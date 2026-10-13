import { useState } from "react";

import {
  categories,
} from "../context/LibraryContext";

function BookForm({
  initialData,
  onSubmit,
  submitText,
  onCancel,
}) {
  const initialCategory =
    categories.includes(initialData?.category)
      ? initialData?.category || ""
      : "Other";

  const [formData, setFormData] = useState({
    isbn: initialData?.isbn || "",
    title: initialData?.title || "",
    author: initialData?.author || "",
    category: initialCategory,
    customCategory:
      initialCategory === "Other"
        ? initialData?.category || ""
        : "",
    quantity:
      initialData?.quantity || 1,
  });

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim()
        : formData.category;

    if (!finalCategory) {
      return;
    }

    onSubmit({
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      category: finalCategory,
      quantity: Number(formData.quantity),
    });
  };

  return (
    <form
      className="professional-form"
      onSubmit={handleSubmit}
    >

      <div className="form-grid">

        <div className="form-group">
          <label>ISBN *</label>

          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            required
          />
        </div>

        <div className="form-group">
          <label>Book Title *</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label>Author *</label>

          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {formData.category === "Other" && (
          <div className="form-group">
            <label>Custom Category *</label>

            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Total Copies *</label>

          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <small>
            Total number of physical copies
            owned by the library.
          </small>
        </div>

      </div>

      <div className="form-footer">

        <button
          type="button"
          className="button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-action-button"
        >
          {submitText}
        </button>

      </div>

    </form>
  );
}

export default BookForm;