


const express = require("express");
const sendEmail = require("../utils/email");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    await sendEmail({
      email: "shivrajdesai222@gmail.com", // receiver email
      subject: `Contact Form Message from ${name}`,
      message: `New message from ${name} (${email}):\n\n${message}`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;