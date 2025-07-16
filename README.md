# Fullstack Node.js + React Project

## Project Overview
This is a fullstack web application with a Node.js/Express backend and a React frontend. The backend handles API routes, authentication, and database models, while the frontend provides the user interface for interacting with the application.

## Folder Structure

```
server/
  index.js                # Entry point for the backend server
  models/                 # Mongoose models (cart, order, product, user)
  routes/                 # Express route handlers (auth, cart, order, product)
  package.json            # Backend dependencies and scripts
  frontend/               # React frontend application
    package.json          # Frontend dependencies and scripts
    public/               # Static files for React
    src/                  # React source code
      App.js              # Main React component
      context/            # React context (e.g., AuthContext)
      pages/              # React pages (AdminPanel, Cart, Login, Orders, Products)
      styles/             # CSS files for styling
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd server
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
```

### 4. Start the backend server
```bash
# From the server/ directory
npm start
```

### 5. Start the frontend development server
```bash
cd frontend
npm start
```

## Available Commands

### Backend (from `server/` directory):
- `npm install`      # Install backend dependencies
- `npm start`        # Start the backend server

### Frontend (from `server/frontend/` directory):
- `npm install`      # Install frontend dependencies
- `npm start`        # Start the React development server

## Notes
- The backend server typically runs on port 5000, and the frontend on port 3000.
- Environment variables can be set in a `.env` file in the `server/` directory.
- Make sure MongoDB is running if your backend uses it.

---
Feel free to customize this README as your project evolves! 
