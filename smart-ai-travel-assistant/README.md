# Smart AI Travel Assistant

A modern AI-powered travel assistant website with chatbot, voice support, and travel recommendations.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Database**: Mock JSON Data (Simulated)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository** (if applicable)
2.  **Setup the Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend will run on `http://localhost:5000`.

3.  **Setup the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`.

## Features
- **AI Chatbot**: Simulated conversation with flight/hotel suggestions.
- **Voice Support**: Simulated voice input and response.
- **Dashboard**: View upcoming trips and travel stats.
- **Mock Auth**: Login with explicit credentials (e.g., `admin@example.com` / `password`).

## Mock Data
The backend uses JSON files in `backend/data/` to simulate a database. You can edit these files to change the "database" state.
