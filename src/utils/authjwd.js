// utils/auth.js
import jwt from "jsonwebtoken";

// Function to generate a token
function generateToken(user) {
  const payload = { username: user.username }; // Data to include in the token
  const secretKey = process.env.JWT_SECRET; // Secret key for signing the token
  const options = { expiresIn: "1h" }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
}

// Function to verify a token
function verifyToken(token) {
  const secretKey = process.env.JWT_SECRET;

  try {
    return jwt.verify(token, secretKey); // Verify the token
  } catch (err) {
    console.log(err);
    return null; // Return null if verification fails
  }
}

module.exports = { generateToken, verifyToken };
