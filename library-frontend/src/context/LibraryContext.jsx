import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LibraryContext = createContext(null);

const initialBooks = [
  {
    id: "B001",
    isbn: "9780132350884",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    quantity: 5,
  },
  {
    id: "B002",
    isbn: "9780073523323",
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Database",
    quantity: 3,
  },
  {
    id: "B003",
    isbn: "9780132126953",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    category: "Networking",
    quantity: 4,
  },
];

export const categories = [
  "Programming",
  "Networking",
  "Database",
  "Science",
  "Mathematics",
  "Other",
];

function getTodayString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + days);

  const newYear = date.getFullYear();
  const newMonth = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const newDay = String(
    date.getDate()
  ).padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay}`;
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => {
    const saved =
      localStorage.getItem("libraryBooks");

    return saved
      ? JSON.parse(saved)
      : initialBooks;
  });

  const [transactions, setTransactions] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "libraryTransactions"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  const [lastBookNumber, setLastBookNumber] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "lastBookNumber"
        );

      if (saved) {
        return Number(saved);
      }

      const numbers = initialBooks.map(
        (book) =>
          Number(
            book.id.replace("B", "")
          )
      );

      return Math.max(...numbers);
    });

  const [
    lastTransactionNumber,
    setLastTransactionNumber,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "lastTransactionNumber"
      );

    if (saved) {
      return Number(saved);
    }

    return 0;
  });

  useEffect(() => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "lastBookNumber",
      String(lastBookNumber)
    );
  }, [lastBookNumber]);

  useEffect(() => {
    localStorage.setItem(
      "lastTransactionNumber",
      String(lastTransactionNumber)
    );
  }, [lastTransactionNumber]);

  /*
    A transaction is active until it has
    a returnDate.
  */
  const isActiveTransaction = (
    transaction
  ) => {
    return !transaction.returnDate;
  };

  /*
    Overdue is calculated from the date,
    rather than manually stored.
  */
  const isTransactionOverdue = (
    transaction
  ) => {
    if (transaction.returnDate) {
      return false;
    }

    return (
      transaction.dueDate <
      getTodayString()
    );
  };

  const getTransactionStatus = (
    transaction
  ) => {
    if (transaction.returnDate) {
      return (
        transaction.status ||
        "Returned"
      );
    }

    if (
      isTransactionOverdue(transaction)
    ) {
      return "Overdue";
    }

    return "Borrowed";
  };

  const getBorrowedCount = (bookId) => {
    return transactions.filter(
      (transaction) =>
        transaction.bookId === bookId &&
        isActiveTransaction(transaction)
    ).length;
  };

  const getAvailableCount = (book) => {
    const borrowed =
      getBorrowedCount(book.id);

    return Math.max(
      Number(book.quantity) - borrowed,
      0
    );
  };

  const getMemberActiveLoans = (
    memberId
  ) => {
    return transactions.filter(
      (transaction) =>
        transaction.memberId ===
          memberId &&
        isActiveTransaction(transaction)
    );
  };

  const memberHasOverdueLoan = (
    memberId
  ) => {
    return getMemberActiveLoans(
      memberId
    ).some((transaction) =>
      isTransactionOverdue(transaction)
    );
  };

  const isbnExists = (
    isbn,
    excludeId = null
  ) => {
    return books.some(
      (book) =>
        book.isbn
          .trim()
          .toLowerCase() ===
          isbn.trim().toLowerCase() &&
        book.id !== excludeId
    );
  };

  const addBook = (bookData) => {
    if (isbnExists(bookData.isbn)) {
      return {
        success: false,
        message:
          "A book with this ISBN already exists.",
      };
    }

    const nextNumber =
      lastBookNumber + 1;

    const newId =
      `B${String(nextNumber).padStart(
        3,
        "0"
      )}`;

    const newBook = {
      id: newId,
      isbn: bookData.isbn.trim(),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      category:
        bookData.category.trim(),
      quantity:
        Number(bookData.quantity),
    };

    setBooks((current) => [
      ...current,
      newBook,
    ]);

    setLastBookNumber(nextNumber);

    return {
      success: true,
      book: newBook,
    };
  };

  const updateBook = (
    bookId,
    bookData
  ) => {
    const existingBook = books.find(
      (book) => book.id === bookId
    );

    if (!existingBook) {
      return {
        success: false,
        message: "Book not found.",
      };
    }

    if (
      isbnExists(
        bookData.isbn,
        bookId
      )
    ) {
      return {
        success: false,
        message:
          "Another book already uses this ISBN.",
      };
    }

    const borrowedCount =
      getBorrowedCount(bookId);

    const newQuantity =
      Number(bookData.quantity);

    if (
      newQuantity < borrowedCount
    ) {
      return {
        success: false,
        message:
          `Quantity cannot be less than ${borrowedCount} because ${borrowedCount} copies are currently borrowed.`,
      };
    }

    const updatedBook = {
      ...existingBook,
      isbn: bookData.isbn.trim(),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      category:
        bookData.category.trim(),
      quantity: newQuantity,
    };

    setBooks((current) =>
      current.map((book) =>
        book.id === bookId
          ? updatedBook
          : book
      )
    );

    return {
      success: true,
      book: updatedBook,
    };
  };

  const deleteBook = (bookId) => {
    if (
      getBorrowedCount(bookId) > 0
    ) {
      return {
        success: false,
        message:
          "This book cannot be deleted because copies are currently borrowed.",
      };
    }

    setBooks((current) =>
      current.filter(
        (book) => book.id !== bookId
      )
    );

    return {
      success: true,
    };
  };

  /*
    BORROWING RULES

    1. Book must exist.
    2. Member must exist - checked by UI.
    3. Available copy required.
    4. Maximum 3 active loans.
    5. Member cannot borrow the same
       title twice simultaneously.
    6. Member with overdue books cannot
       borrow another book.
  */
  const borrowBook = (
    member,
    bookId
  ) => {
    const book = books.find(
      (item) => item.id === bookId
    );

    if (!book) {
      return {
        success: false,
        message: "Book not found.",
      };
    }

    const activeLoans =
      getMemberActiveLoans(member.id);

    if (activeLoans.length >= 3) {
      return {
        success: false,
        message:
          "This member has reached the maximum limit of 3 borrowed books.",
      };
    }

    if (
      memberHasOverdueLoan(member.id)
    ) {
      return {
        success: false,
        message:
          "This member has an overdue book. It must be returned before borrowing another book.",
      };
    }

    const alreadyBorrowed =
      activeLoans.some(
        (transaction) =>
          transaction.bookId ===
          book.id
      );

    if (alreadyBorrowed) {
      return {
        success: false,
        message:
          "This member already has a copy of this book.",
      };
    }

    if (
      getAvailableCount(book) <= 0
    ) {
      return {
        success: false,
        message:
          "No copies of this book are currently available.",
      };
    }

    const borrowDate =
      getTodayString();

    const dueDate =
      addDays(borrowDate, 14);

    const nextNumber =
      lastTransactionNumber + 1;

    const transactionId =
      `T${String(nextNumber).padStart(
        3,
        "0"
      )}`;

    const transaction = {
      id: transactionId,

      memberId: member.id,
      memberName: member.name,

      bookId: book.id,
      bookTitle: book.title,

      borrowDate,
      dueDate,

      returnDate: null,

      status: "Borrowed",
    };

    setTransactions((current) => [
      transaction,
      ...current,
    ]);

    setLastTransactionNumber(
      nextNumber
    );

    return {
      success: true,
      transaction,
    };
  };

  const returnBook = (
    transactionId
  ) => {
    const transaction =
      transactions.find(
        (item) =>
          item.id === transactionId
      );

    if (!transaction) {
      return {
        success: false,
        message:
          "Transaction not found.",
      };
    }

    if (transaction.returnDate) {
      return {
        success: false,
        message:
          "This book has already been returned.",
      };
    }

    const returnDate =
      getTodayString();

    const returnedLate =
      returnDate >
      transaction.dueDate;

    const finalStatus =
      returnedLate
        ? "Returned Late"
        : "Returned";

    setTransactions((current) =>
      current.map((item) =>
        item.id === transactionId
          ? {
              ...item,
              returnDate,
              status: finalStatus,
            }
          : item
      )
    );

    return {
      success: true,
      status: finalStatus,
    };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        transactions,

        addBook,
        updateBook,
        deleteBook,

        borrowBook,
        returnBook,

        getBorrowedCount,
        getAvailableCount,

        getMemberActiveLoans,
        memberHasOverdueLoan,

        isTransactionOverdue,
        getTransactionStatus,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}