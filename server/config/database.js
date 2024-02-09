// Connection to MongoDB Database ProductList

const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://pranavmkulkarni:Mongo_2024@cluster0.1lmn7io.mongodb.net/ProductList";
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URL);
    console.log(`Connected to MongoDB Database ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};

module.exports = connectDB;
