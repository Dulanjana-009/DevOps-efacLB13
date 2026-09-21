import {
  BookMarked,
  History,
  CalendarClock,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLibrary,
} from "../context/LibraryContext";

function MyBooks() {
  const {
    currentUser,
  } = useAuth();

  const {
    transactions,
    getTransactionStatus,
  } = useLibrary();

  const myTransactions =
    transactions.filter(
      (transaction) =>
        transaction.memberId ===
        currentUser?.id
    );

  const activeLoans =
    myTransactions.filter(
      (transaction) =>
        !transaction.returnDate
    );

  return (
    <div>

      <div className="page-title-section">

        <div>
          <h1>My Books</h1>

          <p>
            View your borrowed books,
            due dates and borrowing
            history.
          </p>
        </div>

      </div>

      <div className="member-book-summary">

        <div className="member-book-stat">

          <div className="quick-icon blue">
            <BookMarked size={21} />
          </div>

          <div>
            <span>
              Currently Borrowed
            </span>

            <strong>
              {activeLoans.length}
            </strong>
          </div>

        </div>

        <div className="member-book-stat">

          <div className="quick-icon indigo">
            <History size={21} />
          </div>

          <div>
            <span>
              Total Transactions
            </span>

            <strong>
              {myTransactions.length}
            </strong>
          </div>

        </div>

      </div>

      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>
              Currently Borrowed
            </h2>

            <p>
              Books that are currently
              issued to you.
            </p>
          </div>

          <CalendarClock size={20} />
        </div>

        {activeLoans.length === 0 ? (
          <div className="small-empty-state">
            You currently have no
            borrowed books.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="modern-table">

              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {activeLoans.map(
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
                          <strong>
                            {
                              transaction.bookTitle
                            }
                          </strong>

                          <div className="table-secondary">
                            {
                              transaction.bookId
                            }
                          </div>
                        </td>

                        <td>
                          {
                            transaction.borrowDate
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
                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>
              Borrowing History
            </h2>

            <p>
              Your complete library
              borrowing activity.
            </p>
          </div>

          <History size={20} />

        </div>

        {myTransactions.length === 0 ? (
          <div className="small-empty-state">
            You don't have any
            borrowing history yet.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="modern-table">

              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {myTransactions.map(
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
                          {
                            transaction.bookTitle
                          }
                        </td>

                        <td>
                          {
                            transaction.borrowDate
                          }
                        </td>

                        <td>
                          {
                            transaction.dueDate
                          }
                        </td>

                        <td>
                          {
                            transaction.returnDate ||
                            "-"
                          }
                        </td>

                        <td>
                          <TransactionBadge
                            status={
                              status
                            }
                          />
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

export default MyBooks;