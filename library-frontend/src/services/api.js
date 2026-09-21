const API_URL = "http://localhost:5000/api";

export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
};

export const addBook = async (book) => {
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error("Failed to add book");
  }

  return response.json();
};

export const updateBook = async (id, book) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return response.json();
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }

  return response.json();
};
