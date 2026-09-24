require("dotenv").config();
const mongoose = require("mongoose"); 

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGO_DB_NAME,
            serverSelectionTimeoutMS: 10000,
        })
        console.log(`MongoDB connection SUCCESS (database: ${mongoose.connection.name})`);
    } catch (error) {
        console.error("MongoDB connection FAIL:", error.message);
        process.exit(1);

    }
}
module.exports = connectDB;
