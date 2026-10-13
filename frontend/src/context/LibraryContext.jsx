import { createContext, useContext, useEffect, useState } from "react";
import { booksApi, transactionsApi } from "../services/api";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext(null);
export const categories = ["Programming", "Networking", "Database", "Science", "Mathematics", "Other"];

const dateOnly = (value) => value ? String(value).slice(0, 10) : null;
const normalizeTransaction = (t) => ({
  ...t,
  id: t.id || t._id,
  memberCode: t.memberId || "",
  memberId: t.memberObjectId || t.memberId,
  bookId: t.bookId,
  borrowDate: dateOnly(t.borrowDate),
  dueDate: dateOnly(t.dueDate),
  returnDate: dateOnly(t.returnDate),
});
const normalizeBook = (b) => ({ ...b, id: b.id || b._id });

export function LibraryProvider({ children }) {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const refreshLibrary = async () => {
    if (!currentUser) { setBooks([]); setTransactions([]); return; }
    try {
      const [bookData, transactionData] = await Promise.all([booksApi.list(), transactionsApi.list()]);
      setBooks(bookData.map(normalizeBook));
      setTransactions(transactionData.map(normalizeTransaction));
    } catch (error) {
      console.error("Failed to load library data:", error.message);
    }
  };

  useEffect(() => { refreshLibrary(); }, [currentUser?.id]);

  const isActiveTransaction = (t) => !t.returnDate;
  const isTransactionOverdue = (t) => !t.returnDate && t.dueDate < new Date().toISOString().slice(0, 10);
  const getTransactionStatus = (t) => t.status || (t.returnDate ? "Returned" : isTransactionOverdue(t) ? "Overdue" : "Borrowed");
  const getBorrowedCount = (bookId) => transactions.filter((t) => t.bookId === bookId && isActiveTransaction(t)).length;
  const getAvailableCount = (book) => book.availableCount ?? Math.max(Number(book.quantity) - getBorrowedCount(book.id), 0);
  const getMemberActiveLoans = (memberId) => transactions.filter((t) => t.memberId === memberId && isActiveTransaction(t));
  const memberHasOverdueLoan = (memberId) => getMemberActiveLoans(memberId).some(isTransactionOverdue);

  const addBook = async (bookData) => {
    try {
      const book = normalizeBook(await booksApi.create({ ...bookData, quantity: Number(bookData.quantity) }));
      setBooks((current) => [book, ...current]);
      return { success: true, book };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const updateBook = async (bookId, bookData) => {
    try {
      const book = normalizeBook(await booksApi.update(bookId, { ...bookData, quantity: Number(bookData.quantity) }));
      setBooks((current) => current.map((b) => b.id === bookId ? book : b));
      return { success: true, book };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const deleteBook = async (bookId) => {
    try {
      await booksApi.remove(bookId);
      setBooks((current) => current.filter((b) => b.id !== bookId));
      return { success: true };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const borrowBook = async (member, bookId) => {
    try {
      const transaction = normalizeTransaction(await transactionsApi.borrow(member.id, bookId));
      setTransactions((current) => [transaction, ...current]);
      setBooks((current) => current.map((b) => b.id === bookId && b.availableCount != null ? { ...b, availableCount: b.availableCount - 1 } : b));
      return { success: true, transaction };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const returnBook = async (transactionId) => {
    try {
      const updated = normalizeTransaction(await transactionsApi.returnBook(transactionId));
      setTransactions((current) => current.map((t) => t.id === transactionId ? updated : t));
      await refreshLibrary();
      return { success: true, status: updated.status };
    } catch (error) { return { success: false, message: error.message }; }
  };

  return <LibraryContext.Provider value={{
    books, transactions, addBook, updateBook, deleteBook, borrowBook, returnBook,
    getBorrowedCount, getAvailableCount, getMemberActiveLoans, memberHasOverdueLoan,
    isTransactionOverdue, getTransactionStatus, refreshLibrary,
  }}>{children}</LibraryContext.Provider>;
}

export function useLibrary() { return useContext(LibraryContext); }
