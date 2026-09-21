import { useState } from "react";
import { Link } from "react-router-dom";

function Books() {

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      quantity: 5,
    },
    {
      id: 2,
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      category: "Database",
      quantity: 3,
    },
    {
      id: 3,
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      category: "Networking",
      quantity: 4,
    },
  ]);

  const deleteBook = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      setBooks(
        books.filter((book) => book.id !== id)
      );
    }
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Books</h1>
          <p>Manage library books</p>
        </div>

        <Link
          to="/books/add"
          className="primary-btn"
        >
          + Add Book
        </Link>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {books.map((book) => (

              <tr key={book.id}>

                <td>{book.id}</td>

                <td>
                  <strong>{book.title}</strong>
                </td>

                <td>{book.author}</td>

                <td>{book.category}</td>

                <td>{book.quantity}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      alert(
                        `Edit functionality for ${book.title} will be added next.`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBook(book.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Books;