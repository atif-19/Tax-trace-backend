// mongoose to talk to the mongodb database
const mongoose = require('mongoose');

// connect database function 
const connectDB = async () => {
    try {
        // to connect to our mongodb atlas database
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // if connected show it in console
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {// if any error occur catch that 
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;