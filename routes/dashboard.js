const express = require("express");
const Book = require("../models/Book");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { auth } = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", auth, async (req, res) => {
  try {
    const books = await Book.find();
    const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);

    const totalMembers = await User.countDocuments({ role: "member" });

    const activeTransactions = await Transaction.find({
      returnDate: null,
    })
      .populate("member", "name memberId")
      .populate("book", "title isbn");

    const borrowedBooks = activeTransactions.length;
    const availableBooks = totalBooks - borrowedBooks;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const overdueItems = activeTransactions.filter((t) => {
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return now > due;
    });

    const recentTransactions = await Transaction.find()
      .populate("member", "name memberId")
      .populate("book", "title isbn")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBooks,
      totalMembers,
      borrowedBooks,
      availableBooks,
      overdueCount: overdueItems.length,
      recentTransactions,
      overdueItems,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
