import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMember() {

  const navigate = useNavigate();

  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (event) => {

    const { name, value } = event.target;

    setMember({
      ...member,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    console.log("Member:", member);

    alert("Member added successfully!");

    navigate("/members");
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Add Member</h1>
          <p>Register a new library member</p>
        </div>

      </div>

      <div className="form-container">

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter member name"
              value={member.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={member.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={member.phone}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/members")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Add Member
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMember;