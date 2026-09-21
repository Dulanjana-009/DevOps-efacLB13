function Dashboard() {
  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to the Library Management System</p>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">📚</div>

          <div>
            <p>Total Books</p>
            <h2>120</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👥</div>

          <div>
            <p>Total Members</p>
            <h2>45</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📖</div>

          <div>
            <p>Borrowed Books</p>
            <h2>18</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">✅</div>

          <div>
            <p>Available Books</p>
            <h2>102</h2>
          </div>
        </div>

      </div>

      <div className="dashboard-section">

        <h2>Recent Activity</h2>

        <table>

          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Kamal Perera</td>
              <td>Clean Code</td>
              <td>
                <span className="badge borrowed">
                  Borrowed
                </span>
              </td>
              <td>2026-09-20</td>
            </tr>

            <tr>
              <td>Nimal Silva</td>
              <td>Database Systems</td>
              <td>
                <span className="badge returned">
                  Returned
                </span>
              </td>
              <td>2026-09-19</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;
