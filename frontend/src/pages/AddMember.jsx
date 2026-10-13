import {
  ArrowLeft,
  UserPlus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import MemberForm
  from "../components/MemberForm";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useToast,
} from "../context/ToastContext";

function AddMember() {
  const navigate = useNavigate();

  const {
    createMember,
  } = useAuth();

  const {
    showToast,
  } = useToast();

  const handleSubmit = async (memberData) => {
    const result =
      await createMember(memberData);

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      `${result.member.name} registered successfully.`,
      "success"
    );

    navigate(
      `/members/${result.member.id}`
    );
  };

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

      <div className="page-title-section">
        <div>
          <h1>Add Member</h1>

          <p>
            Register a new library
            member and login account.
          </p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-card-heading">

          <div className="form-heading-icon">
            <UserPlus size={22} />
          </div>

          <div>
            <h2>Member Information</h2>

            <p>
              The member ID will be
              generated automatically.
            </p>
          </div>

        </div>

        <MemberForm
          submitText="Add Member"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate("/members")
          }
        />

      </div>

    </div>
  );
}

export default AddMember;