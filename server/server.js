const express = require("express");
const axios = require("axios");
const env = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/database.js");
const Product = require("./model/Product.js");

//Express Object
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//SERVER PORT
const PORT = 8080;

//Search API
app.get("/search", async (req, res) => {
  const { name } = req.query;
  await connectDB();

  try {
    let filteredProducts;

    if (name) {
      // Ensure name is treated as a string
      const searchString = String(name);

      // Check if the search string contains only digits
      if (/^\d*$/.test(searchString)) {
        // Modified regex to match zero or more digits
        // Search only in price and quantity if the search string contains only digits
        filteredProducts = await Product.find({
          $or: [{ price: searchString }, { quantity: searchString }],
        });
      } else if (/^[a-zA-Z\s]+$/.test(searchString)) {
        // Search in name and product fields if the search string contains only letters and spaces
        const regex = new RegExp(searchString, "i");
        filteredProducts = await Product.find({
          $or: [{ name: { $regex: regex } }, { product: { $regex: regex } }],
        });
      } else {
        // Extract numeric and string components from the search string
        const numericValue = searchString.match(/\d+/g);
        const stringValue = searchString.match(/[a-zA-Z]+/g);

        // Build regex for string search
        const stringRegex = stringValue
          ? new RegExp(stringValue.join("|"), "i")
          : null;

        // Build conditions for the query
        const conditions = [
          { name: stringRegex },
          { product: stringRegex },
          {
            price: numericValue ? numericValue : { $regex: stringRegex },
          },
          {
            quantity: numericValue ? numericValue : { $regex: stringRegex },
          },
        ].filter(
          (condition) =>
            condition.price ||
            condition.quantity ||
            condition.name ||
            condition.product
        );

        // Search in all fields if it contains a mix of strings and numbers
        filteredProducts = await Product.find({
          $or: conditions,
        });
      }
    } else {
      // If no search value provided, return all products
      filteredProducts = await Product.find();
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete API
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await connectDB();
  try {
    // Find the product by its 'id' field and delete it
    await Product.deleteOne({ id: parseInt(id) }); // Parse id to Integer if needed
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Listen PORT
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
