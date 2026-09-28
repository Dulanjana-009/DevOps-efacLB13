const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const formatUser = (user) => ({
  id: user._id,
  memberId: user.memberId,
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("phone").optional().trim(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { name, username, email, phone, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const count = await User.countDocuments({ role: "member" });
      const memberId = `M${String(count + 1).padStart(4, "0")}`;

      const user = new User({
        memberId,
        name,
        username,
        email,
        phone,
        password,
        role: "member",
      });

      await user.save();
      const token = generateToken(user);

      res.status(201).json({ user: formatUser(user), token });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);
      res.json({ user: formatUser(user), token });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json({ user: formatUser(req.user) });
});

// PUT /api/auth/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = req.user;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/change-password
router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { currentPassword, newPassword } = req.body;

      const isMatch = await req.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({ error: "New password must be different" });
      }

      req.user.password = newPassword;
      await req.user.save();
      res.json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
