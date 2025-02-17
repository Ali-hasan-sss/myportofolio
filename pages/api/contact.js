// pages/api/contact.js
import mongoose from "mongoose";

// Define the Contact model
const ContactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  socialLinks: [String], // مصفوفة تحتوي على روابط التواصل الاجتماعي
});

let Contact;
try {
  Contact = mongoose.model("Contact");
} catch (error) {
  Contact = mongoose.model("Contact", ContactSchema);
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

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    // Get all contact data
    try {
      const contact = await Contact.find();
      res.status(200).json(contact);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    // Add or update contact data
    const { phone, email, socialLinks } = req.body;

    try {
      let existingContact = await Contact.findOne();

      if (existingContact) {
        // Update existing record
        existingContact.phone = phone || existingContact.phone;
        existingContact.email = email || existingContact.email;
        existingContact.socialLinks =
          socialLinks || existingContact.socialLinks;
        await existingContact.save();
        res.status(200).json(existingContact);
      } else {
        // Create new record
        const newContact = new Contact({ phone, email, socialLinks });
        await newContact.save();
        res.status(201).json(newContact);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else if (method === "PUT") {
    // Update contact data by ID
    const { id, phone, email, socialLinks } = req.body;

    try {
      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      // Update fields only if provided
      if (phone !== undefined) contact.phone = phone;
      if (email !== undefined) contact.email = email;
      if (socialLinks !== undefined) contact.socialLinks = socialLinks;

      await contact.save();
      res.status(200).json(contact);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else if (method === "DELETE") {
    // Delete contact data by ID
    const { id } = req.query;

    try {
      const deletedContact = await Contact.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.status(200).json({ message: "Contact deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
