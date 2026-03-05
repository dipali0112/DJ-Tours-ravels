const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123'; // Fallback for dev

// Helper to read users
const readUsers = () => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

// Helper to save users
const saveUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error saving users file:", err);
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const users = readUsers();

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            avatar: "", // No default random images
            favorites: [], // Initialize favorites
            preferences: {
                language: 'en',
                currency: 'INR',
                theme: 'light'
            },
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Generate Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const users = readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        // Support both hashed (new) and plain text (legacy/mock) passwords for transition
        const isMatch = await bcrypt.compare(password, user.password);
        const isLegacyMatch = user.password === password; // For existing mock users

        if (!isMatch && !isLegacyMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const users = readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate temporary reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

        saveUsers(users);

        // In a real app, send email here
        console.log(`Reset Token for ${email}: ${resetToken}`);

        res.json({ message: 'Password reset link sent to email (mocked)', resetToken }); // Including token for dev ease

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const users = readUsers();
        const user = users.find(u =>
            u.resetToken === resetToken && u.resetTokenExpiry > Date.now()
        );

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset tokens
        delete user.resetToken;
        delete user.resetTokenExpiry;

        saveUsers(users);

        res.json({ message: 'Password reset successful' });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const users = readUsers();
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    // JWT logout is typically handled by the client by deleting the token.
    res.json({ message: 'Logged out successfully' });
};

exports.toggleFavorite = async (req, res) => {
    try {
        const { destinationId } = req.body;
        if (!destinationId) return res.status(400).json({ message: 'Destination ID required' });

        const users = readUsers();
        const user = users.find(u => u.id === req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favorites) user.favorites = [];

        const index = user.favorites.indexOf(destinationId);
        if (index === -1) {
            user.favorites.push(destinationId);
            saveUsers(users);
            return res.json({ message: 'Added to favorites', favorites: user.favorites });
        } else {
            user.favorites.splice(index, 1);
            saveUsers(users);
            return res.json({ message: 'Removed from favorites', favorites: user.favorites });
        }
    } catch (err) {
        console.error("Toggle favorite error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, location, bio, avatar } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) users[userIndex].name = name;
        if (phone !== undefined) users[userIndex].phone = phone;
        if (location !== undefined) users[userIndex].location = location;
        if (bio !== undefined) users[userIndex].bio = bio;
        if (avatar !== undefined) users[userIndex].avatar = avatar;

        saveUsers(users);

        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updatePreferences = async (req, res) => {
    try {
        const preferences = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[userIndex].preferences = {
            ...users[userIndex].preferences,
            ...preferences
        };

        saveUsers(users);

        res.json({
            message: 'Preferences updated successfully',
            preferences: users[userIndex].preferences
        });
    } catch (err) {
        console.error("Update preferences error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
