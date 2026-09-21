import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  ClipboardList,
  BookMarked,
  User,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { currentUser } = useAuth();

  const role = currentUser?.role;

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const managementItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      path: "/books",
      icon: BookOpen,
    },
    {
      label: "Members",
      path: "/members",
      icon: Users,
    },
    {
      label: "Borrow / Return",
      path: "/borrow-return",
      icon: ArrowLeftRight,
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: ClipboardList,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const memberItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      path: "/books",
      icon: BookOpen,
    },
    {
      label: "My Books",
      path: "/my-books",
      icon: BookMarked,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const items =
    role === "member"
      ? memberItems
      : managementItems;

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
        />
      )}

      <aside
        className={[
          "app-sidebar",
          collapsed
            ? "sidebar-collapsed"
            : "",
          mobileOpen
            ? "mobile-sidebar-open"
            : "",
        ].join(" ")}
      >

        <div className="sidebar-brand">

          <div className="brand-logo">
            <Library size={23} />
          </div>

          {!collapsed && (
            <div className="brand-text">
              <strong>LibraryMS</strong>
              <span>
                Management System
              </span>
            </div>
          )}

          <button
            className="mobile-sidebar-close"
            onClick={closeMobile}
          >
            <X size={20} />
          </button>

        </div>

        <nav className="sidebar-navigation">

          <span className="sidebar-section-label">
            {!collapsed
              ? role === "member"
                ? "MY LIBRARY"
                : "MANAGEMENT"
              : ""}
          </span>

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
              >
                <Icon size={19} />

                {!collapsed && (
                  <span>
                    {item.label}
                  </span>
                )}

              </NavLink>
            );
          })}

        </nav>

        <button
          className="sidebar-collapse-button"
          onClick={() =>
            setCollapsed(
              (current) => !current
            )
          }
        >
          {collapsed ? (
            <PanelLeftOpen
              size={18}
            />
          ) : (
            <>
              <PanelLeftClose
                size={18}
              />

              <span>
                Collapse Sidebar
              </span>
            </>
          )}
        </button>

      </aside>
    </>
  );
}

export default Sidebar;