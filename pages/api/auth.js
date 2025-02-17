import mongoose from "mongoose";

// Define the User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

let User;
try {
  User = mongoose.model("User");
} catch (err) {
  User = mongoose.model("User", UserSchema);
  console.log(err);
}

if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username, password });

      if (user) {
        const token = "your-secret-token"; // Replace with JWT or a secure token generator
        res.status(200).json({ success: true, token });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
