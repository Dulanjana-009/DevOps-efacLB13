import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBook() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: "",
  });

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    console.log("New Book:", formData);

    alert("Book added successfully!");

    navigate("/books");
  };

  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Add Book</h1>
          <p>Add a new book to the library</p>
        </div>
      </div>

      <div className="form-container">

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Book Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Author</label>

            <input
              type="text"
              name="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="Example: Programming"
              value={formData.category}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Quantity</label>

            <input
              type="number"
              name="quantity"
              min="1"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/books")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Add Book
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddBook;