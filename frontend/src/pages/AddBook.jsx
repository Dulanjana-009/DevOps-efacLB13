import {
  ArrowLeft,
  BookPlus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import BookForm from "../components/BookForm";

import {
  useLibrary,
} from "../context/LibraryContext";

import {
  useToast,
} from "../context/ToastContext";

function AddBook() {
  const navigate = useNavigate();

  const { addBook } = useLibrary();
  const { showToast } = useToast();

  const handleSubmit = async (bookData) => {
    const result =
      await addBook(bookData);

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      `${result.book.title} added successfully.`,
      "success"
    );

    navigate("/books");
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
          <h1>Add New Book</h1>

          <p>
            Add a new title to the library catalogue.
          </p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-card-heading">
          <div className="form-heading-icon">
            <BookPlus size={22} />
          </div>

          <div>
            <h2>Book Information</h2>
            <p>
              Enter the book's catalogue details.
            </p>
          </div>
        </div>

        <BookForm
          initialData={null}
          submitText="Add Book"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate("/books")
          }
        />

      </div>

    </div>
  );
}

export default AddBook;