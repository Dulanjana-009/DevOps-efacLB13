import { useState } from "react";

function BorrowReturn() {

  const [member, setMember] = useState("");
  const [book, setBook] = useState("");

  const borrowBook = (event) => {

    event.preventDefault();

    if (!member || !book) {
      alert("Please select a member and book.");
      return;
    }

    alert(`${book} borrowed by ${member}`);

    setMember("");
    setBook("");
  };

  const returnBook = (event) => {

    event.preventDefault();

    if (!member || !book) {
      alert("Please select a member and book.");
      return;
    }

    alert(`${book} returned by ${member}`);

    setMember("");
    setBook("");
  };

  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Borrow / Return</h1>
          <p>Manage book borrowing and returns</p>
        </div>
      </div>

      <div className="form-container">

        <div className="form-group">

          <label>Member</label>

          <select
            value={member}
            onChange={(e) =>
              setMember(e.target.value)
            }
          >

            <option value="">
              Select Member
            </option>

            <option>Kamal Perera</option>
            <option>Nimal Silva</option>
            <option>Kasun Fernando</option>

          </select>

        </div>

        <div className="form-group">

          <label>Book</label>

          <select
            value={book}
            onChange={(e) =>
              setBook(e.target.value)
            }
          >

            <option value="">
              Select Book
            </option>

            <option>Clean Code</option>
            <option>Database System Concepts</option>
            <option>Computer Networks</option>

          </select>

        </div>

        <div className="borrow-actions">

          <button
            className="primary-btn"
            onClick={borrowBook}
          >
            Borrow Book
          </button>

          <button
            className="return-btn"
            onClick={returnBook}
          >
            Return Book
          </button>

        </div>

      </div>

    </div>
  );
}

export default BorrowReturn;