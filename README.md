# Expense-Split


## Overview
**Expense-Split** is a web application that helps users to track shared expenses and settle up easily within groups.

Built using the MERN stack with Tailwind CSS for styling and JWT-based authentication.

## Features
- User authentication and authorization (signup/login)
- Adding friends, managing friend lists.
- Creating and managing expense groups
- Adding and tracking shared expenses
- Settling up and viewing Transactions
- Responsive design

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT)
- Cookie-Parser
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed or access to MongoDB Atlas

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-split.git
cd expense-split
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root and add:
```bash
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Development Server
- To start the frontend:
```bash
npm run dev
```
- To start the backend:
```bash
npm run server
```
