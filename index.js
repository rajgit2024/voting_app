// Import required packages
const express = require('express');
const session = require("express-session");
const userRoute = require('./routes/userRoutes.js');
const cookieParser = require("cookie-parser");
const morgan = require('morgan'); // Optional for logging

// Initialize the Express app
const app = express();
require("dotenv").config();

// Middleware for logging requests
app.use(morgan('dev')); // Logs requests to the console

// Middleware to parse incoming JSON requests
app.use(express.json());  // Parse JSON bodies

// Middleware to parse URL-encoded bodies (like form data)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESS_SEC,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production', // secure only in production
  }
}));

// Define a simple GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Use user routes
app.use("/user", userRoute);

// Define a POST route to handle incoming data
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({
    message: 'Data received successfully!',
    receivedData: data
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});