import {
  ArrowLeftRight,
  BookOpen,
  Search,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

import { useState } from "react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLibrary,
} from "../context/LibraryContext";

import {
  useToast,
} from "../context/ToastContext";

import ConfirmModal
  from "../components/ConfirmModal";

function BorrowReturn() {
  const { users } = useAuth();

  const {
    books,
    transactions,

    borrowBook,
    returnBook,

    getAvailableCount,
    getMemberActiveLoans,
    memberHasOverdueLoan,
    getTransactionStatus,
  } = useLibrary();

  const { showToast } = useToast();

  const [selectedMemberId, setSelectedMemberId] =
    useState("");

  const [selectedBookId, setSelectedBookId] =
    useState("");

  const [returnSearch, setReturnSearch] =
    useState("");

  const [
    transactionToReturn,
    setTransactionToReturn,
  ] = useState(null);

  const members = users.filter(
    (user) => user.role === "member"
  );

  const selectedMember =
    members.find(
      (member) =>
        member.id === selectedMemberId
    );

  const selectedBook =
    books.find(
      (book) =>
        book.id === selectedBookId
    );

  const activeTransactions =
    transactions.filter(
      (transaction) =>
        !transaction.returnDate
    );

  const filteredActiveTransactions =
    activeTransactions.filter(
      (transaction) => {
        const search =
          returnSearch.toLowerCase();

        return (
          transaction.memberName
            .toLowerCase()
            .includes(search) ||
          transaction.memberId
            .toLowerCase()
            .includes(search) ||
          transaction.bookTitle
            .toLowerCase()
            .includes(search)
        );
      }
    );

  const handleBorrow = (
    event
  ) => {
    event.preventDefault();

    if (!selectedMember) {
      showToast(
        "Please select a member.",
        "error"
      );

      return;
    }

    if (!selectedBook) {
      showToast(
        "Please select a book.",
        "error"
      );

      return;
    }

    const result = borrowBook(
      selectedMember,
      selectedBook.id
    );

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      `${selectedBook.title} issued to ${selectedMember.name}.`,
      "success"
    );

    setSelectedBookId("");
  };

  const handleReturn = () => {
    if (!transactionToReturn) {
      return;
    }

    const result = returnBook(
      transactionToReturn.id
    );

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      setTransactionToReturn(null);
      return;
    }

    showToast(
      result.status ===
        "Returned Late"
        ? "Book returned successfully. It was returned late."
        : "Book returned successfully.",
      "success"
    );

    setTransactionToReturn(null);
  };

  const activeLoanCount =
    selectedMember
      ? getMemberActiveLoans(
          selectedMember.id
        ).length
      : 0;

  const hasOverdue =
    selectedMember
      ? memberHasOverdueLoan(
          selectedMember.id
        )
      : false;

  return (
    <div>

      <div className="page-title-section">
        <div>
          <h1>Borrow / Return</h1>

          <p>
            Issue books to members and
            process book returns.
          </p>
        </div>
      </div>

      <div className="borrow-layout">

        <section className="form-card borrow-card">

          <div className="form-card-heading">

            <div className="form-heading-icon">
              <ArrowLeftRight
                size={22}
              />
            </div>

            <div>
              <h2>Issue a Book</h2>

              <p>
                Books are issued for
                14 days.
              </p>
            </div>

          </div>

          <form onSubmit={handleBorrow}>

            <div className="form-group">
              <label>
                Select Member *
              </label>

              <select
                value={selectedMemberId}
                onChange={(event) => {
                  setSelectedMemberId(
                    event.target.value
                  );

                  setSelectedBookId("");
                }}
                required
              >
                <option value="">
                  Select member
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.id} -{" "}
                      {member.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {selectedMember && (
              <div className="borrow-member-summary">

                <div>
                  <span>
                    Active Loans
                  </span>

                  <strong>
                    {activeLoanCount} / 3
                  </strong>
                </div>

                <div>
                  <span>
                    Borrowing Status
                  </span>

                  {hasOverdue ? (
                    <strong className="text-danger">
                      Overdue book
                    </strong>
                  ) : (
                    <strong className="text-success">
                      Eligible
                    </strong>
                  )}
                </div>

              </div>
            )}

            {hasOverdue && (
              <div className="inline-warning">
                <AlertTriangle
                  size={18}
                />

                This member must return
                overdue books before
                borrowing another book.
              </div>
            )}

            <div className="form-group">
              <label>
                Select Book *
              </label>

              <select
                value={selectedBookId}
                onChange={(event) =>
                  setSelectedBookId(
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Select book
                </option>

                {books.map((book) => {
                  const available =
                    getAvailableCount(
                      book
                    );

                  return (
                    <option
                      key={book.id}
                      value={book.id}
                      disabled={
                        available === 0
                      }
                    >
                      {book.id} -{" "}
                      {book.title} (
                      {available} available)
                      {available === 0
                        ? " - Unavailable"
                        : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedBook && (
              <div className="selected-book-summary">

                <BookOpen size={20} />

                <div>
                  <strong>
                    {selectedBook.title}
                  </strong>

                  <span>
                    {
                      getAvailableCount(
                        selectedBook
                      )
                    }{" "}
                    of{" "}
                    {
                      selectedBook.quantity
                    }{" "}
                    copies available
                  </span>
                </div>

              </div>
            )}

            <button
              type="submit"
              className="primary-action-button full-width-button"
              disabled={
                hasOverdue ||
                activeLoanCount >= 3
              }
            >
              <BookOpen size={18} />
              Issue Book
            </button>

          </form>

        </section>

        <section className="content-card return-card">

          <div className="return-card-header">

            <div>
              <h2>Active Loans</h2>

              <p>
                Select a borrowing
                record to process a
                return.
              </p>
            </div>

            <span className="loan-count">
              {
                activeTransactions.length
              }{" "}
              active
            </span>

          </div>

          <div className="return-search">

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search member or book..."
                value={returnSearch}
                onChange={(event) =>
                  setReturnSearch(
                    event.target.value
                  )
                }
              />
            </div>

          </div>

          {filteredActiveTransactions.length ===
          0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                <RotateCcw
                  size={25}
                />
              </div>

              <h3>
                No active loans
              </h3>

              <p>
                Borrowed books will
                appear here.
              </p>

            </div>
          ) : (
            <div className="table-wrapper">

              <table className="modern-table">

                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Member</th>
                    <th>Book</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Return</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredActiveTransactions.map(
                    (transaction) => {
                      const status =
                        getTransactionStatus(
                          transaction
                        );

                      return (
                        <tr
                          key={
                            transaction.id
                          }
                        >
                          <td>
                            <span className="book-id">
                              {
                                transaction.id
                              }
                            </span>
                          </td>

                          <td>
                            <strong>
                              {
                                transaction.memberName
                              }
                            </strong>

                            <div className="table-secondary">
                              {
                                transaction.memberId
                              }
                            </div>
                          </td>

                          <td>
                            {
                              transaction.bookTitle
                            }
                          </td>

                          <td>
                            {
                              transaction.dueDate
                            }
                          </td>

                          <td>
                            <TransactionBadge
                              status={
                                status
                              }
                            />
                          </td>

                          <td>
                            <button
                              className="return-button"
                              onClick={() =>
                                setTransactionToReturn(
                                  transaction
                                )
                              }
                            >
                              <RotateCcw
                                size={15}
                              />
                              Return
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

      <ConfirmModal
        open={Boolean(
          transactionToReturn
        )}
        title="Return book?"
        message={
          transactionToReturn
            ? `Confirm the return of "${transactionToReturn.bookTitle}" from ${transactionToReturn.memberName}.`
            : ""
        }
        confirmText="Confirm Return"
        onCancel={() =>
          setTransactionToReturn(
            null
          )
        }
        onConfirm={handleReturn}
      />

    </div>
  );
}

function TransactionBadge({
  status,
}) {
  const cssClass =
    status
      .toLowerCase()
      .replaceAll(" ", "-");

  return (
    <span
      className={`status-badge ${cssClass}`}
    >
      <span></span>
      {status}
    </span>
  );
}

export default BorrowReturn;