import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "foodexpress_secret_2026";

/* ── Nodemailer transporter (lazy — created per request) ── */
const createTransporter = () => nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ── REGISTER ── */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Don't auto-login after register — just return success
    res.status(201).json({ message: "Account created successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── LOGIN ── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── FORGOT PASSWORD — send OTP ── */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Check email config
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
      return res.status(500).json({
        message: "Email service not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env",
      });
    }

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Food Express" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP — Food Express",
      html: `
        <div style="font-family:Poppins,sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #f0f0f0;">
          <h2 style="color:#e85d26;margin:0 0 8px;">Food Express</h2>
          <p style="color:#555;">You requested a password reset. Use the OTP below:</p>
          <div style="font-size:2.5rem;font-weight:800;letter-spacing:8px;color:#1a1a1a;text-align:center;padding:20px;background:#fff2ee;border-radius:12px;margin:20px 0;">
            ${otp}
          </div>
          <p style="color:#aaa;font-size:0.85rem;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── VERIFY OTP ── */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // OTP valid — issue a short-lived reset token
    const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, JWT_SECRET, { expiresIn: "15m" });

    res.json({ message: "OTP verified.", resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── RESET PASSWORD ── */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    if (decoded.purpose !== "reset") {
      return res.status(400).json({ message: "Invalid token purpose." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashed,
      otp: null,
      otpExpiry: null,
    });

    res.json({ message: "Password reset successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
