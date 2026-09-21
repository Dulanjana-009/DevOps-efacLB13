import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import {
  useLibrary,
} from "../context/LibraryContext";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useToast,
} from "../context/ToastContext";

import ConfirmModal from "../components/ConfirmModal";

function Books() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    books,
    deleteBook,
    getBorrowedCount,
    getAvailableCount,
  } = useLibrary();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");

  const [bookToDelete, setBookToDelete] =
    useState(null);

  const isAdmin =
    currentUser?.role === "admin";

  const canManage =
    currentUser?.role === "admin" ||
    currentUser?.role === "librarian";

  const filteredBooks = books.filter(
    (book) =>
      book.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (!bookToDelete) {
      return;
    }

    const result =
      deleteBook(bookToDelete.id);

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      setBookToDelete(null);

      return;
    }

    showToast(
      "Book deleted successfully.",
      "success"
    );

    setBookToDelete(null);
  };

  return (
    <div>

      <div className="page-title-section">

        <div>
          <h1>Books</h1>

          <p>
            Browse and manage the library catalogue.
          </p>
        </div>

        {canManage && (
          <Link
            to="/books/add"
            className="primary-action-button"
          >
            <Plus size={18} />
            Add Book
          </Link>
        )}

      </div>

      <div className="content-card">

        <div className="table-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search books by title..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="record-count">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}
          </div>

        </div>

        {filteredBooks.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <BookOpen size={26} />
            </div>

            <h3>No books found</h3>

            <p>
              {search
                ? "Try another book title."
                : "No books have been added yet."}
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="modern-table">

              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => {

                  const borrowed =
                    getBorrowedCount(book.id);

                  const available =
                    getAvailableCount(book);

                  return (
                    <tr key={book.id}>

                      <td>
                        <span className="book-id">
                          {book.id}
                        </span>
                      </td>

                      <td>{book.isbn}</td>

                      <td>
                        <button
                          className="book-title-link"
                          onClick={() =>
                            navigate(
                              `/books/${book.id}`
                            )
                          }
                        >
                          {book.title}
                        </button>
                      </td>

                      <td>{book.author}</td>

                      <td>
                        <span className="category-chip">
                          {book.category}
                        </span>
                      </td>

                      <td>{book.quantity}</td>

                      <td>
                        <strong>
                          {available}
                        </strong>
                      </td>

                      <td>
                        <AvailabilityBadge
                          available={available}
                        />
                      </td>

                      <td>
                        <div className="table-actions">

                          <button
                            title="View"
                            onClick={() =>
                              navigate(
                                `/books/${book.id}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          {canManage && (
                            <button
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/books/edit/${book.id}`
                                )
                              }
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              className="danger-icon-button"
                              title={
                                borrowed > 0
                                  ? "Cannot delete borrowed book"
                                  : "Delete"
                              }
                              onClick={() =>
                                setBookToDelete(book)
                              }
                            >
                              <Trash2 size={17} />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <ConfirmModal
        open={Boolean(bookToDelete)}
        title="Delete book?"
        message={
          bookToDelete
            ? `Are you sure you want to delete "${bookToDelete.title}"? This action cannot be undone.`
            : ""
        }
        onCancel={() =>
          setBookToDelete(null)
        }
        onConfirm={handleDelete}
      />

    </div>
  );
}

function AvailabilityBadge({ available }) {
  if (available === 0) {
    return (
      <span className="availability unavailable">
        <span></span>
        Unavailable
      </span>
    );
  }

  if (available === 1) {
    return (
      <span className="availability low">
        <span></span>
        Low Stock
      </span>
    );
  }

  return (
    <span className="availability available">
      <span></span>
      Available
    </span>
  );
}

export default Books;