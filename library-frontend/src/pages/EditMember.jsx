import {
  ArrowLeft,
  UserRoundPen,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import MemberForm
  from "../components/MemberForm";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useToast,
} from "../context/ToastContext";

function EditMember() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    users,
    updateMember,
  } = useAuth();

  const {
    showToast,
  } = useToast();

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

  const handleSubmit = (memberData) => {
    const result =
      updateMember(
        member.id,
        memberData
      );

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      "Member updated successfully.",
      "success"
    );

    navigate(
      `/members/${member.id}`
    );
  };

  return (
    <div>

      <button
        className="back-button"
        onClick={() =>
          navigate(
            `/members/${member.id}`
          )
        }
      >
        <ArrowLeft size={17} />
        Back to Member
      </button>

      <div className="page-title-section">
        <div>
          <h1>Edit Member</h1>

          <p>
            Update account information
            for {member.id}.
          </p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-card-heading">

          <div className="form-heading-icon">
            <UserRoundPen size={22} />
          </div>

          <div>
            <h2>Member Information</h2>

            <p>
              Changes will also update
              the member's account.
            </p>
          </div>

        </div>

        <MemberForm
          initialData={member}
          submitText="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              `/members/${member.id}`
            )
          }
        />

      </div>

    </div>
  );
}

export default EditMember;