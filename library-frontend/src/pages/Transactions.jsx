import {
  ClipboardList,
  Search,
} from "lucide-react";

import { useState } from "react";

import {
  useLibrary,
} from "../context/LibraryContext";

function Transactions() {
  const {
    transactions,
    getTransactionStatus,
  } = useLibrary();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const term =
          search.toLowerCase();

        const status =
          getTransactionStatus(
            transaction
          );

        const matchesSearch =
          transaction.memberName
            .toLowerCase()
            .includes(term) ||
          transaction.memberId
            .toLowerCase()
            .includes(term) ||
          transaction.bookTitle
            .toLowerCase()
            .includes(term) ||
          transaction.bookId
            .toLowerCase()
            .includes(term);

        let matchesFilter = true;

        if (filter === "Borrowed") {
          matchesFilter =
            status === "Borrowed";
        }

        if (filter === "Returned") {
          matchesFilter =
            status === "Returned" ||
            status ===
              "Returned Late";
        }

        if (filter === "Overdue") {
          matchesFilter =
            status === "Overdue";
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  return (
    <div>

      <div className="page-title-section">

        <div>
          <h1>Transactions</h1>

          <p>
            View the complete borrowing
            and return history.
          </p>
        </div>

      </div>

      <div className="content-card">

        <div className="transaction-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search member or book..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="filter-buttons">

            {[
              "All",
              "Borrowed",
              "Returned",
              "Overdue",
            ].map((item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {filteredTransactions.length ===
        0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              <ClipboardList
                size={26}
              />
            </div>

            <h3>
              No transactions found
            </h3>

            <p>
              Transactions matching your
              search and filter will
              appear here.
            </p>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="modern-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
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

      </div>

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

export default Transactions;