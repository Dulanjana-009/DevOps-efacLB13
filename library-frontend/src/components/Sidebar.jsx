import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        📚 LibraryMS
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          📖 Books
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          👥 Members
        </NavLink>

        <NavLink
          to="/borrow-return"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🔄 Borrow / Return
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;