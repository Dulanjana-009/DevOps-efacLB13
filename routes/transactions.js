const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

const getTransactionStatus = (transaction) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (transaction.returnDate) {
    const dueDate = new Date(transaction.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const returnDate = new Date(transaction.returnDate);
    returnDate.setHours(0, 0, 0, 0);
    return returnDate > dueDate ? "Returned Late" : "Returned";
  }

  const dueDate = new Date(transaction.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  return now > dueDate ? "Overdue" : "Borrowed";
};

const formatTransaction = (t) => ({
  id: t._id,
  transactionId: t.transactionId,
  memberId: t.member?.memberId || "",
  memberName: t.member?.name || "",
  memberObjectId: t.member?._id,
  bookId: t.book?._id,
  bookTitle: t.book?.title || "",
  bookIsbn: t.book?.isbn || "",
  borrowDate: t.borrowDate,
  dueDate: t.dueDate,
  returnDate: t.returnDate,
  status: getTransactionStatus(t),
});

// GET /api/transactions
router.get("/", auth, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query.member = req.user._id;
    }

    const transactions = await Transaction.find(query)
      .populate("member", "name memberId")
      .populate("book", "title isbn")
      .sort({ createdAt: -1 });

    res.json(transactions.map(formatTransaction));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/transactions/active
router.get("/active", auth, async (req, res) => {
  try {
    let query = { returnDate: null };

    if (req.user.role === "member") {
      query.member = req.user._id;
    }

    const transactions = await Transaction.find(query)
      .populate("member", "name memberId")
      .populate("book", "title isbn")
      .sort({ createdAt: -1 });

    res.json(transactions.map(formatTransaction));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/transactions/borrow
router.post(
  "/borrow",
  auth,
  authorize("admin", "librarian"),
  async (req, res) => {
    try {
      const { memberId, bookId } = req.body;

      const member = await User.findById(memberId);
      if (!member || member.role !== "member") {
        return res.status(400).json({ error: "Invalid member" });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(400).json({ error: "Book not found" });
      }

      const activeBorrows = await Transaction.countDocuments({
        book: bookId,
        returnDate: null,
      });
      if (activeBorrows >= book.quantity) {
        return res.status(400).json({ error: "No copies available" });
      }

      const memberActiveLoans = await Transaction.find({
        member: memberId,
        returnDate: null,
      }).populate("book", "title");

      if (memberActiveLoans.length >= 3) {
        return res
          .status(400)
          .json({ error: "Member already has 3 active loans" });
      }

      const alreadyBorrowed = memberActiveLoans.some(
        (t) => t.book._id.toString() === bookId
      );
      if (alreadyBorrowed) {
        return res
          .status(400)
          .json({ error: "Member already has this book borrowed" });
      }

      const overdueLoans = await Transaction.find({
        member: memberId,
        returnDate: null,
      });
      const hasOverdue = overdueLoans.some(
        (t) => getTransactionStatus(t) === "Overdue"
      );
      if (hasOverdue) {
        return res
          .status(400)
          .json({ error: "Member has overdue books and cannot borrow" });
      }

      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const transaction = new Transaction({
        member: memberId,
        book: bookId,
        borrowDate,
        dueDate,
      });

      await transaction.save();

      const populated = await Transaction.findById(transaction._id)
        .populate("member", "name memberId")
        .populate("book", "title isbn");

      res.status(201).json(formatTransaction(populated));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT /api/transactions/:id/return
router.put(
  "/:id/return",
  auth,
  authorize("admin", "librarian"),
  async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate("member", "name memberId")
        .populate("book", "title isbn");

      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      if (transaction.returnDate) {
        return res.status(400).json({ error: "Book already returned" });
      }

      transaction.returnDate = new Date();
      await transaction.save();

      res.json(formatTransaction(transaction));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// GET /api/transactions/member/:memberId
router.get("/member/:memberId", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      member: req.params.memberId,
    })
      .populate("member", "name memberId")
      .populate("book", "title isbn")
      .sort({ createdAt: -1 });

    res.json(transactions.map(formatTransaction));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
