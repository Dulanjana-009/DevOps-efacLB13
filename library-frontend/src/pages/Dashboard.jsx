import {
  BookOpen,
  Users,
  BookMarked,
  LibraryBig,
  Plus,
  UserPlus,
  ArrowLeftRight,
  ArrowRight,
  Clock,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";

function Dashboard() {
  const { currentUser, users } = useAuth();
  const { books, transactions,getTransactionStatus, } = useLibrary();

  const members = users.filter(
    (user) => user.role === "member"
  );

  const totalBooks = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const activeBorrowings =
  transactions.filter(
    (transaction) =>
      !transaction.returnDate
  );

  const overdueTransactions =
  activeBorrowings.filter(
    (transaction) =>
      getTransactionStatus(
        transaction
      ) === "Overdue"
  );

  const borrowedBooks = activeBorrowings.length;

  const availableBooks = Math.max(
    totalBooks - borrowedBooks,
    0
  );

  const isStaff =
    currentUser?.role === "admin" ||
    currentUser?.role === "librarian";

  return (
    <div className="dashboard-page">

      <div className="page-title-section">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {currentUser?.name}. Here's what's
            happening in your library.
          </p>
        </div>

        <div className="current-date">
          <Clock size={17} />
          {new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="stat-grid">

        <StatCard
          title="Total Books"
          value={totalBooks}
          subtitle={`${books.length} book titles`}
          icon={<BookOpen />}
          type="blue"
        />

        <StatCard
          title="Total Members"
          value={members.length}
          subtitle="Registered members"
          icon={<Users />}
          type="indigo"
        />

        <StatCard
          title="Borrowed Books"
          value={borrowedBooks}
          subtitle="Currently issued"
          icon={<BookMarked />}
          type="orange"
        />

        <StatCard
          title="Available Books"
          value={availableBooks}
          subtitle="Ready to borrow"
          icon={<LibraryBig />}
          type="green"
        />

      </div>

      {isStaff && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Common library operations</p>
            </div>
          </div>

          <div className="quick-actions">

            <Link to="/books/add" className="quick-action-card">
              <div className="quick-icon blue">
                <Plus size={22} />
              </div>

              <div>
                <strong>Add New Book</strong>
                <span>Add a book to the catalogue</span>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link to="/members/add" className="quick-action-card">
              <div className="quick-icon indigo">
                <UserPlus size={22} />
              </div>

              <div>
                <strong>Add Member</strong>
                <span>Register a new member</span>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link
              to="/borrow-return"
              className="quick-action-card"
            >
              <div className="quick-icon green">
                <ArrowLeftRight size={22} />
              </div>

              <div>
                <strong>Issue Book</strong>
                <span>Create a borrowing record</span>
              </div>

              <ArrowRight size={18} />
            </Link>

          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Recent Transactions</h2>
            <p>Latest library activity</p>
          </div>

          {isStaff && (
            <Link
              to="/transactions"
              className="text-link"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ArrowLeftRight size={27} />
            </div>

            <h3>No transactions yet</h3>

            <p>
              Borrowing and return activity will appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions
                  .slice(0, 5)
                  .map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.memberName}
                      </td>

                      <td>
                        {transaction.bookTitle}
                      </td>

                      <td>
                        {transaction.borrowDate || "-"}
                      </td>

                      <td>
                        {transaction.dueDate || "-"}
                      </td>

                      <td>
                        <StatusBadge
                          status={getTransactionStatus(transaction)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isStaff && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Overdue Books</h2>
              <p>Items requiring attention</p>
            </div>
          </div>

          {overdueTransactions.length === 0 ? (
            <div className="small-empty-state">
              No overdue books at the moment.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Book</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {overdueTransactions
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.memberName}</td>
                        <td>{item.bookTitle}</td>
                        <td>{item.dueDate}</td>
                        <td>
                          <StatusBadge status={getTransactionStatus(transaction)} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  type,
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const normalized =
    status?.toLowerCase() || "borrowed";

  return (
    <span className={`status-badge ${normalized}`}>
      <span></span>
      {status || "Borrowed"}
    </span>
  );
}

export default Dashboard;