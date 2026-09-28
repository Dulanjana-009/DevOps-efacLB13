require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/Book");

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Book.deleteMany({});

  const users = await User.create([
    {
      name: "Admin User",
      username: "admin",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Library Staff",
      username: "librarian",
      password: "lib123",
      role: "librarian",
    },
    {
      memberId: "M0001",
      name: "Demo Member",
      username: "member",
      email: "member@example.com",
      phone: "0771234567",
      password: "member123",
      role: "member",
    },
  ]);

  await Book.create([
    {
      isbn: "978-0-13-468599-1",
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      category: "Technology",
      quantity: 3,
    },
    {
      isbn: "978-0-06-112008-4",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
      quantity: 5,
    },
    {
      isbn: "978-0-7432-7356-5",
      title: "1984",
      author: "George Orwell",
      category: "Fiction",
      quantity: 4,
    },
    {
      isbn: "978-0-596-51774-8",
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      category: "Technology",
      quantity: 2,
    },
    {
      isbn: "978-0-14-028329-7",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      quantity: 3,
    },
  ]);

  console.log("Database seeded successfully!");
  console.log("Default accounts:");
  console.log("  admin / admin123");
  console.log("  librarian / lib123");
  console.log("  member / member123");

  await mongoose.connection.close();
};

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
