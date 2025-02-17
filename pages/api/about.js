import mongoose from "mongoose";
import multer from "multer";

// Configure multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Define the About model
const AboutSchema = new mongoose.Schema({
  image: String, // Store image as Base64 string
  name: String,
  education: String,
  profession: String,
  phoneNo: String,
  email: String,
  adress: String,
  date_of_birth: String,
  description: String,
});

let About;
try {
  About = mongoose.model("About");
} catch (error) {
  About = mongoose.model("About", AboutSchema);
  console.log(error);
}

// Connect to MongoDB if not connected
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      throw err; // Stop execution if connection fails
    });
}

// Disable default body parser because we use multer
export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const about = await About.find();
      res.status(200).json(about);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    // Use multer middleware to handle file uploads
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Invalid file upload" });
      }

      const { file } = req; // Get uploaded file
      const {
        name,
        description,
        education,
        phoneNo,
        email,
        date_of_birth,
        adress,
        profession,
      } = req.body;

      try {
        let existingAbout = await About.findOne();

        if (existingAbout) {
          // Update existing record
          if (file) {
            existingAbout.image = file.buffer.toString("base64"); // Convert file to Base64
          }
          existingAbout.name = name || existingAbout.name;
          existingAbout.description = description || existingAbout.description;
          existingAbout.education = education || existingAbout.education;
          existingAbout.phoneNo = phoneNo || existingAbout.phoneNo;
          existingAbout.email = email || existingAbout.email;
          existingAbout.adress = adress || existingAbout.adress;
          existingAbout.date_of_birth =
            date_of_birth || existingAbout.date_of_birth;
          existingAbout.profession = profession || existingAbout.profession;
          await existingAbout.save();
          res.status(200).json(existingAbout);
        } else {
          // Create new record
          const newAbout = new About({
            image: file ? file.buffer.toString("base64") : "", // Convert file to Base64
            name,
            description,
            education,
            adress,
            date_of_birth,
            email,
            phoneNo,
            profession,
          });
          await newAbout.save();
          res.status(201).json(newAbout);
        }
      } catch (err) {
        console.error("Error processing request:", err); // Log error for debugging
        res.status(400).json({ message: err.message });
      }
    });
  } else if (method === "DELETE") {
    try {
      await About.deleteMany();
      res.status(200).json({ message: "All about data deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
