const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, '../data/orders.json');

// Helper to read orders
const getOrders = () => {
    try {
        const data = fs.readFileSync(ordersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to save orders
const saveOrders = (orders) => {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};

router.post('/process', (req, res) => {
    const { plan, amount, userDetails, paymentMethod } = req.body;

    // Basic Validation
    if (!plan || !amount || !userDetails || !userDetails.email) {
        return res.status(400).json({ message: 'Missing required order details.' });
    }

    // Simulate Processing Delay
    setTimeout(() => {
        const orders = getOrders();

        // Save Order
        const newOrder = {
            id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            plan,
            amount,
            currency: 'INR',
            status: 'COMPLETED',
            userDetails,
            paymentMethod: {
                type: 'card',
                last4: paymentMethod?.cardNumber?.slice(-4) || '4242'
            },
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        saveOrders(orders);

        // Update User Subscription (Mock Logic)
        const usersFile = path.join(__dirname, '../data/users.json');
        try {
            const usersData = fs.readFileSync(usersFile, 'utf8');
            let users = JSON.parse(usersData);

            // Find user by email
            const userIndex = users.findIndex(u => u.email === userDetails.email);
            if (userIndex !== -1) {
                users[userIndex].subscription = {
                    plan,
                    status: 'active',
                    startDate: new Date().toISOString(),
                    lastPaymentId: newOrder.id
                };
                fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
            }
        } catch (err) {
            console.error('Error updating user subscription:', err);
        }

        res.status(201).json({
            message: 'Payment successful!',
            orderId: newOrder.id,
            receiptUrl: `/receipts/${newOrder.id}`
        });
    }, 1500); // 1.5s delay for realism
});

module.exports = router;
