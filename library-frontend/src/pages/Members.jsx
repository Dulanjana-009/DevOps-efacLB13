import { useState } from "react";
import { Link } from "react-router-dom";

function Members() {

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Kamal Perera",
      email: "kamal@example.com",
      phone: "0712345678",
    },
    {
      id: 2,
      name: "Nimal Silva",
      email: "nimal@example.com",
      phone: "0771234567",
    },
    {
      id: 3,
      name: "Kasun Fernando",
      email: "kasun@example.com",
      phone: "0769876543",
    },
  ]);

  const deleteMember = (id) => {

    if (window.confirm("Delete this member?")) {

      setMembers(
        members.filter((member) => member.id !== id)
      );

    }
  };

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Members</h1>
          <p>Manage registered library members</p>
        </div>

        <Link
          to="/members/add"
          className="primary-btn"
        >
          + Add Member
        </Link>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {members.map((member) => (

              <tr key={member.id}>

                <td>{member.id}</td>

                <td>
                  <strong>{member.name}</strong>
                </td>

                <td>{member.email}</td>

                <td>{member.phone}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      alert(
                        `Edit ${member.name} will be added next.`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMember(member.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Members;