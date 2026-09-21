import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  User,
  BookOpen,
  History,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLibrary,
} from "../context/LibraryContext";

function MemberDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { users } = useAuth();

  const {
    transactions,getTransactionStatus,
  } = useLibrary();

  const member = users.find(
    (user) =>
      user.id === id &&
      user.role === "member"
  );

  if (!member) {
    return (
      <Navigate
        to="/members"
        replace
      />
    );
  }

  const memberTransactions =
    transactions.filter(
      (transaction) =>
        transaction.memberId === member.id
    );

  const activeLoans =
  memberTransactions.filter(
    (transaction) =>
      !transaction.returnDate
  );

  return (
    <div>

      <button
        className="back-button"
        onClick={() =>
          navigate("/members")
        }
      >
        <ArrowLeft size={17} />
        Back to Members
      </button>

      <div className="member-profile-header">

        <div className="large-member-avatar">
          {getInitials(member.name)}
        </div>

        <div className="member-profile-title">
          <span>{member.id}</span>

          <h1>{member.name}</h1>

          <p>Library Member</p>
        </div>

        <span className="account-status active">
          <span></span>
          Active
        </span>

        <button
          className="primary-action-button"
          onClick={() =>
            navigate(
              `/members/edit/${member.id}`
            )
          }
        >
          <Pencil size={17} />
          Edit Member
        </button>

      </div>

      <div className="member-information-grid">

        <InfoCard
          icon={<User />}
          label="Member ID"
          value={member.id}
        />

        <InfoCard
          icon={<Mail />}
          label="Email Address"
          value={member.email}
        />

        <InfoCard
          icon={<Phone />}
          label="Phone Number"
          value={member.phone}
        />

        <InfoCard
          icon={<BookOpen />}
          label="Currently Borrowed"
          value={activeLoans.length}
        />

      </div>

      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Currently Borrowed</h2>

            <p>
              Books currently issued
              to this member.
            </p>
          </div>
        </div>

        {activeLoans.length === 0 ? (
          <div className="small-empty-state">
            This member has no currently
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
                  (transaction) => (
                    <tr
                      key={
                        transaction.id
                      }
                    >
                      <td>
                        {transaction.bookTitle}
                      </td>

                      <td>
                        {transaction.borrowDate}
                      </td>

                      <td>
                        {transaction.dueDate}
                      </td>

                      <td>
                        <TransactionStatus
                          status={
                           getTransactionStatus(transaction)
                          }
                        />
                      </td>
                    </tr>
                  )
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
              Transaction History
            </h2>

            <p>
              Previous borrowing and
              return activity.
            </p>
          </div>

          <History size={20} />

        </div>

        {memberTransactions.length === 0 ? (
          <div className="small-empty-state">
            No transaction history yet.
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
                {memberTransactions.map(
                  (transaction) => (
                    <tr
                      key={
                        transaction.id
                      }
                    >
                      <td>
                        {transaction.bookTitle}
                      </td>

                      <td>
                        {transaction.borrowDate}
                      </td>

                      <td>
                        {transaction.dueDate}
                      </td>

                      <td>
                        {transaction.returnDate ||
                          "-"}
                      </td>

                      <td>
                        <TransactionStatus
                          status={
                            getTransactionStatus(transaction)
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="member-info-card">

      <div className="detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function TransactionStatus({
  status,
}) {
  const normalized =
    status?.toLowerCase() ||
    "borrowed";

  return (
    <span
      className={`status-badge ${normalized}`}
    >
      <span></span>
      {status}
    </span>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default MemberDetails;