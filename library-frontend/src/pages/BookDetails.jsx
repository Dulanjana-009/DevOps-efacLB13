import {
  ArrowLeft,
  BookOpen,
  Pencil,
  Hash,
  User,
  Layers,
  LibraryBig,
  BookMarked,
  CheckCircle,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useLibrary,
} from "../context/LibraryContext";

import {
  useAuth,
} from "../context/AuthContext";

function BookDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    books,
    getBorrowedCount,
    getAvailableCount,
  } = useLibrary();

  const book = books.find(
    (item) => item.id === id
  );

  if (!book) {
    return (
      <Navigate
        to="/books"
        replace
      />
    );
  }

  const borrowed =
    getBorrowedCount(book.id);

  const available =
    getAvailableCount(book);

  const canEdit =
    currentUser?.role === "admin" ||
    currentUser?.role === "librarian";

  return (
    <div>

      <button
        className="back-button"
        onClick={() =>
          navigate("/books")
        }
      >
        <ArrowLeft size={17} />
        Back to Books
      </button>

      <div className="details-header">

        <div className="book-large-icon">
          <BookOpen size={31} />
        </div>

        <div className="details-title">
          <span>{book.id}</span>

          <h1>{book.title}</h1>

          <p>by {book.author}</p>
        </div>

        {canEdit && (
          <button
            className="primary-action-button"
            onClick={() =>
              navigate(
                `/books/edit/${book.id}`
              )
            }
          >
            <Pencil size={17} />
            Edit Book
          </button>
        )}

      </div>

      <div className="details-grid">

        <DetailItem
          icon={<Hash />}
          label="ISBN"
          value={book.isbn}
        />

        <DetailItem
          icon={<User />}
          label="Author"
          value={book.author}
        />

        <DetailItem
          icon={<Layers />}
          label="Category"
          value={book.category}
        />

        <DetailItem
          icon={<LibraryBig />}
          label="Total Copies"
          value={book.quantity}
        />

        <DetailItem
          icon={<CheckCircle />}
          label="Available Copies"
          value={available}
        />

        <DetailItem
          icon={<BookMarked />}
          label="Borrowed Copies"
          value={borrowed}
        />

      </div>

      <div className="availability-panel">

        <div>
          <span>Current Availability</span>

          <strong>
            {available} of {book.quantity} copies available
          </strong>
        </div>

        <AvailabilityStatus
          available={available}
        />

      </div>

    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-card">

      <div className="detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function AvailabilityStatus({
  available,
}) {
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

export default BookDetails;