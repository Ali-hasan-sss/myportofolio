// seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
});

let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit if connection fails
  });

// Function to create a user
async function createUser() {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("User already exists. Skipping creation.");
      process.exit(0);
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create a new user
    const newUser = new User({
      username: "admin",
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating user:", err);
    process.exit(1);
  }
}

// Call the function after connecting to MongoDB
mongoose.connection.once("open", () => {
  createUser();
});
