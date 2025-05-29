// pages/api/send-email.js
import sendEmail from "../../utils/email";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  try {
    await sendEmail({
      email: 'shivrajdesai222@gmail.com', // Your email address where you want to receive messages
      subject: `Contact Form Message from ${name}`,
      message: `You have a new message from ${name} (${email}):\n\n${message}`
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
