const dotenv = require('dotenv').config({ path: './config/.env' });
const { mongoose } = require('mongoose')

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected");
  } catch (e) {
    console.log("MongoDB not connected");
  }
};

module.exports = connectDB;