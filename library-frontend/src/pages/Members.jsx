import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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

function Members() {
  const navigate = useNavigate();

  const {
    users,
    currentUser,
    deleteMemberAccount,
  } = useAuth();

  const {
    transactions,
  } = useLibrary();

  const {
    showToast,
  } = useToast();

  const [search, setSearch] =
    useState("");

  const [
    memberToDelete,
    setMemberToDelete,
  ] = useState(null);

  const members = users.filter(
    (user) => user.role === "member"
  );

  const isAdmin =
    currentUser?.role === "admin";

  const filteredMembers =
    members.filter((member) => {
      const term =
        search.toLowerCase();

      return (
        member.name
          .toLowerCase()
          .includes(term) ||
        member.id
          .toLowerCase()
          .includes(term)
      );
    });

  const getActiveLoans = (memberId) => {
    return transactions.filter(
      (transaction) =>
        transaction.memberId === memberId &&
        (
          transaction.status === "Borrowed" ||
          transaction.status === "Overdue"
        )
    );
  };

  const handleDelete = () => {
    if (!memberToDelete) {
      return;
    }

    const activeLoans =
      getActiveLoans(
        memberToDelete.id
      );

    if (activeLoans.length > 0) {
      showToast(
        "This member cannot be deleted because they currently have borrowed books.",
        "error"
      );

      setMemberToDelete(null);
      return;
    }

    const result =
      deleteMemberAccount(
        memberToDelete.id
      );

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      setMemberToDelete(null);
      return;
    }

    showToast(
      "Member deleted successfully.",
      "success"
    );

    setMemberToDelete(null);
  };

  return (
    <div>

      <div className="page-title-section">

        <div>
          <h1>Members</h1>

          <p>
            Manage registered library
            members and their accounts.
          </p>
        </div>

        <Link
          to="/members/add"
          className="primary-action-button"
        >
          <UserPlus size={18} />
          Add Member
        </Link>

      </div>

      <div className="content-card">

        <div className="table-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by member name or ID..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="record-count">
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1
              ? "member"
              : "members"}
          </div>

        </div>

        {filteredMembers.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              <Users size={27} />
            </div>

            <h3>No members found</h3>

            <p>
              {search
                ? "Try another name or member ID."
                : "No members have been registered."}
            </p>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="modern-table">

              <thead>
                <tr>
                  <th>Member</th>
                  <th>Member ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Borrowed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map(
                  (member) => {

                    const activeLoans =
                      getActiveLoans(
                        member.id
                      );

                    return (
                      <tr key={member.id}>

                        <td>
                          <div className="member-cell">

                            <div className="member-avatar">
                              {getInitials(
                                member.name
                              )}
                            </div>

                            <button
                              className="member-name-link"
                              onClick={() =>
                                navigate(
                                  `/members/${member.id}`
                                )
                              }
                            >
                              {member.name}
                            </button>

                          </div>
                        </td>

                        <td>
                          <span className="book-id">
                            {member.id}
                          </span>
                        </td>

                        <td>
                          {member.email}
                        </td>

                        <td>
                          {member.phone}
                        </td>

                        <td>
                          {activeLoans.length}
                        </td>

                        <td>
                          <span className="account-status active">
                            <span></span>
                            Active
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">

                            <button
                              title="View member"
                              onClick={() =>
                                navigate(
                                  `/members/${member.id}`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              title="Edit member"
                              onClick={() =>
                                navigate(
                                  `/members/edit/${member.id}`
                                )
                              }
                            >
                              <Pencil size={17} />
                            </button>

                            {isAdmin && (
                              <button
                                className="danger-icon-button"
                                title="Delete member"
                                onClick={() =>
                                  setMemberToDelete(
                                    member
                                  )
                                }
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
                            )}

                          </div>
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

      <ConfirmModal
        open={Boolean(memberToDelete)}
        title="Delete member?"
        message={
          memberToDelete
            ? `Are you sure you want to delete ${memberToDelete.name}? Their login account will also be removed.`
            : ""
        }
        confirmText="Delete Member"
        onCancel={() =>
          setMemberToDelete(null)
        }
        onConfirm={handleDelete}
      />

    </div>
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

export default Members;