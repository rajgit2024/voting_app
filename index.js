// Import required packages
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());  // Parse JSON bodies

// Middleware to parse URL-encoded bodies (like form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define a POST route to handle incoming data
app.post('/data', (req, res) => {
  // Access the parsed JSON or URL-encoded data from req.body
  const data = req.body;
  res.json({
    message: 'Data received successfully!',
    receivedData: data
  });
});

// Start the server and listen on port 3000
const PORT = 3000 || PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
