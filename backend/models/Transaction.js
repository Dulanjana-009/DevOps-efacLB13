const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const count = await mongoose.model("Transaction").countDocuments();
    this.transactionId = `T${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
