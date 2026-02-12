require('dotenv').config(); // Load variables from .env file
const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/db'); // Import the DB config
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
// Connect to Database
connectDB();


server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});