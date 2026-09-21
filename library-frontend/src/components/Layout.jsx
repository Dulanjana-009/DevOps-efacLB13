import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar
  from "./Sidebar";

import Navbar
  from "./Navbar";

import ConfirmModal
  from "./ConfirmModal";

import {
  useAuth,
} from "../context/AuthContext";

function Layout({ children }) {
  const navigate = useNavigate();

  const {
    logout,
  } = useAuth();

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [
    logoutModalOpen,
    setLogoutModalOpen,
  ] = useState(false);

 const handleLogout = () => {
  setLogoutModalOpen(false);
  logout();
  navigate("/login", { replace: true });
};

  return (
    <div className="app-shell">

      <Sidebar
        collapsed={
          sidebarCollapsed
        }
        setCollapsed={
          setSidebarCollapsed
        }
        mobileOpen={
          mobileSidebarOpen
        }
        setMobileOpen={
          setMobileSidebarOpen
        }
      />

      <div
        className={
          sidebarCollapsed
            ? "app-main sidebar-is-collapsed"
            : "app-main"
        }
      >

        <Navbar
          onMenuClick={() =>
            setMobileSidebarOpen(
              true
            )
          }
          onLogoutRequest={() =>
            setLogoutModalOpen(
              true
            )
          }
        />

        <main className="page-content">
          {children}
        </main>

      </div>

      <ConfirmModal
        open={logoutModalOpen}
        title="Logout?"
        message="Are you sure you want to sign out of LibraryMS?"
        confirmText="Logout"
        onCancel={() =>
          setLogoutModalOpen(false)
        }
        onConfirm={
          handleLogout
        }
      />

    </div>
  );
}

export default Layout;