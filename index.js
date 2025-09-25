require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========================
// MongoDB Connection
// ========================
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "subscriptions" })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========================
// Email Schema
// ========================
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  registeredAt: { type: Date, default: Date.now },
});
const Email = mongoose.model("Email", emailSchema);

// ========================
// Nodemailer Transporter
// ========================
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// ========================
// Send Email Function
// ========================
const sendEmail = async (to, subject, html) => {
  try {
    await transport.sendMail({
      from: `"Waitlist App" <${process.env.SMTP_USERNAME}>`,
      to,
      subject,
      html,
    });
    console.log(`📩 Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error(`❌ Error sending email to ${to}:`, err.message);
    return false;
  }
};

// ========================
// Subscribe (Save + Send Email)
// ========================
app.post("/sendMessage", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    // Check if already subscribed
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "This email is already subscribed." });
    }

    // Save email
    const newEmail = new Email({ email });
    await newEmail.save();

    // Send confirmation email
    const subject = "Subscription Confirmation";
    const html = `
      <div style="font-family:Arial,sans-serif;padding:20px;background:#f4f4f4;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;text-align:center;">
          <h2 style="color:#3b82f6;">Subscription Confirmed 🎉</h2>
          <p>Hi, your email <b>${email}</b> has been successfully subscribed.</p>
          <p>We’ll notify you as soon as the application is available.</p>
          <hr style="margin:20px 0;">
          <p style="font-size:12px;color:#888;">ᯤ Developed by 
            <a href="https://www.linkedin.com/in/manikdev" target="_blank">Manik</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      message: "Email subscribed and confirmation sent successfully.",
    });
  } catch (err) {
    console.error("❌ Error in subscribe:", err);
    res.status(500).json({ message: "Error subscribing email.", error: err });
  }
});

// ========================
// Get All Emails
// ========================
app.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ registeredAt: -1 });
    res.status(200).json({ count: emails.length, emails });
  } catch (err) {
    console.error("❌ Error retrieving emails:", err);
    res.status(500).json({ message: "Error retrieving emails.", error: err });
  }
});

// ========================
// Server Health Check
// ========================
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running smoothly", timestamp: new Date() });
});

// ========================
// Start Server
// ========================
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
