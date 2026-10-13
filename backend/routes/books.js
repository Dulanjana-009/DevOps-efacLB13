const express = require("express");
const { body, validationResult } = require("express-validator");
const Book = require("../models/Book");
const Transaction = require("../models/Transaction");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/books
router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    const booksWithAvailability = await Promise.all(
      books.map(async (book) => {
        const activeBorrows = await Transaction.countDocuments({
          book: book._id,
          returnDate: null,
        });
        return {
          ...book.toObject(),
          id: book._id,
          availableCount: book.quantity - activeBorrows,
        };
      })
    );

    res.json(booksWithAvailability);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/books/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const activeBorrows = await Transaction.countDocuments({
      book: book._id,
      returnDate: null,
    });

    res.json({
      ...book.toObject(),
      id: book._id,
      availableCount: book.quantity - activeBorrows,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/books
router.post(
  "/",
  auth,
  authorize("admin", "librarian"),
  [
    body("isbn").trim().notEmpty().withMessage("ISBN is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { isbn, title, author, category, quantity } = req.body;

      const existing = await Book.findOne({ isbn });
      if (existing) {
        return res
          .status(400)
          .json({ error: "A book with this ISBN already exists" });
      }

      const book = new Book({ isbn, title, author, category, quantity });
      await book.save();

      res.status(201).json({ ...book.toObject(), id: book._id });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT /api/books/:id
router.put(
  "/:id",
  auth,
  authorize("admin", "librarian"),
  [
    body("isbn").trim().notEmpty().withMessage("ISBN is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be 0 or more"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { isbn, title, author, category, quantity } = req.body;

      const duplicate = await Book.findOne({
        isbn,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({ error: "Another book with this ISBN already exists" });
      }

      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { isbn, title, author, category, quantity },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ ...book.toObject(), id: book._id });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// DELETE /api/books/:id
router.delete(
  "/:id",
  auth,
  authorize("admin", "librarian"),
  async (req, res) => {
    try {
      const activeLoans = await Transaction.countDocuments({
        book: req.params.id,
        returnDate: null,
      });

      if (activeLoans > 0) {
        return res
          .status(400)
          .json({ error: "Cannot delete a book that is currently borrowed" });
      }

      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
