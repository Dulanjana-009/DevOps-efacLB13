import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import BookForm from "../components/BookForm";

import {
  useLibrary,
} from "../context/LibraryContext";

import {
  useToast,
} from "../context/ToastContext";

function EditBook() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    books,
    updateBook,
    getBorrowedCount,
  } = useLibrary();

  const { showToast } = useToast();

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

  const handleSubmit = (bookData) => {
    const result =
      updateBook(
        book.id,
        bookData
      );

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      "Book updated successfully.",
      "success"
    );

    navigate(
      `/books/${book.id}`
    );
  };

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

      <div className="page-title-section">
        <div>
          <h1>Edit Book</h1>

          <p>
            Update catalogue information for {book.id}.
          </p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-card-heading">

          <div className="form-heading-icon">
            <Pencil size={21} />
          </div>

          <div>
            <h2>Book Information</h2>

            <p>
              {borrowed > 0
                ? `${borrowed} copies are currently borrowed. Total copies cannot be reduced below this number.`
                : "Update the information below."}
            </p>
          </div>

        </div>

        <BookForm
          initialData={book}
          submitText="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              `/books/${book.id}`
            )
          }
        />

      </div>

    </div>
  );
}

export default EditBook;