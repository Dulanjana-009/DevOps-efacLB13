function Navbar() {
  return (
    <header className="navbar">

      <div>
        <h3>Library Management System</h3>
      </div>

      <div className="navbar-right">

        <span className="admin-name">
          👤 Admin
        </span>

        <button
          className="logout-btn"
          onClick={() => alert("Logout will be connected later")}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;