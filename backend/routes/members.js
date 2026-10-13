const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

const formatMember = (user) => ({
  id: user._id,
  memberId: user.memberId,
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// GET /api/members
router.get("/", auth, authorize("admin", "librarian"), async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).sort({
      createdAt: -1,
    });
    res.json(members.map(formatMember));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/members/:id
router.get("/:id", auth, authorize("admin", "librarian"), async (req, res) => {
  try {
    const member = await User.findOne({
      _id: req.params.id,
      role: "member",
    });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const activeLoans = await Transaction.countDocuments({
      member: member._id,
      returnDate: null,
    });

    res.json({ ...formatMember(member), activeLoans });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/members
router.post(
  "/",
  auth,
  authorize("admin", "librarian"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
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

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
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
      res.status(201).json(formatMember(user));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT /api/members/:id
router.put(
  "/:id",
  auth,
  authorize("admin", "librarian"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { name, username, email, phone, password } = req.body;

      const member = await User.findOne({
        _id: req.params.id,
        role: "member",
      });
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      const dupUsername = await User.findOne({
        username,
        _id: { $ne: req.params.id },
      });
      if (dupUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const dupEmail = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (dupEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      member.name = name;
      member.username = username;
      member.email = email;
      member.phone = phone;
      if (password) {
        member.password = password;
      }

      await member.save();
      res.json(formatMember(member));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// DELETE /api/members/:id
router.delete(
  "/:id",
  auth,
  authorize("admin", "librarian"),
  async (req, res) => {
    try {
      const activeLoans = await Transaction.countDocuments({
        member: req.params.id,
        returnDate: null,
      });

      if (activeLoans > 0) {
        return res
          .status(400)
          .json({ error: "Cannot delete member with active loans" });
      }

      const member = await User.findOneAndDelete({
        _id: req.params.id,
        role: "member",
      });
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ message: "Member deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
