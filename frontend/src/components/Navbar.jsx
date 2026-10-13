import {
  Bell,
  Menu,
  User,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useLibrary,
} from "../context/LibraryContext";

function Navbar({
  onMenuClick = () => {},
  onLogoutRequest = () => {},
}) {
  const {
    currentUser,
  } = useAuth();

  const {
    transactions,
    getTransactionStatus,
  } = useLibrary();

  const navigate = useNavigate();

  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target
        )
      ) {
        setUserMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const visibleTransactions =
    currentUser?.role === "member"
      ? transactions.filter(
          (transaction) =>
            transaction.memberId ===
            currentUser.id
        )
      : transactions;

  const activeTransactions =
    visibleTransactions.filter(
      (transaction) =>
        !transaction.returnDate
    );

  const overdue =
    activeTransactions.filter(
      (transaction) =>
        getTransactionStatus(
          transaction
        ) === "Overdue"
    );

  const dueSoon =
    activeTransactions.filter(
      (transaction) => {
        if (
          getTransactionStatus(
            transaction
          ) === "Overdue"
        ) {
          return false;
        }

        const days =
          getDaysUntil(
            transaction.dueDate
          );

        return (
          days >= 0 &&
          days <= 3
        );
      }
    );

  const notificationCount =
    overdue.length +
    dueSoon.length;

  const pageTitle =
    getPageTitle(
      location.pathname
    );

  return (
    <header className="app-navbar">

      <div className="navbar-left">

        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={21} />
        </button>

        <div>
          <h2>{pageTitle}</h2>

          <span>
            Library Management System
          </span>
        </div>

      </div>

      <div className="navbar-right">

        <div
          className="navbar-dropdown-wrapper"
          ref={notificationRef}
        >

          <button
            className="notification-button"
            onClick={() => {
              setNotificationsOpen(
                (current) =>
                  !current
              );

              setUserMenuOpen(false);
            }}
          >
            <Bell size={19} />

            {notificationCount > 0 && (
              <span className="notification-count">
                {notificationCount > 9
                  ? "9+"
                  : notificationCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="navbar-dropdown notification-dropdown">

              <div className="dropdown-heading">
                <div>
                  <strong>
                    Notifications
                  </strong>

                  <span>
                    {notificationCount}{" "}
                    alerts
                  </span>
                </div>
              </div>

              <div className="notification-list">

                {notificationCount ===
                0 ? (
                  <div className="notification-empty">
                    You're all caught up.
                  </div>
                ) : (
                  <>
                    {overdue.map(
                      (transaction) => (
                        <div
                          className="notification-item overdue-notification"
                          key={`overdue-${transaction.id}`}
                        >
                          <div className="notification-icon">
                            <AlertTriangle
                              size={17}
                            />
                          </div>

                          <div>
                            <strong>
                              Overdue book
                            </strong>

                            <p>
                              {
                                transaction.bookTitle
                              }
                            </p>

                            {currentUser?.role !==
                              "member" && (
                              <span>
                                {
                                  transaction.memberName
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    )}

                    {dueSoon.map(
                      (transaction) => (
                        <div
                          className="notification-item"
                          key={`due-${transaction.id}`}
                        >
                          <div className="notification-icon">
                            <Clock3
                              size={17}
                            />
                          </div>

                          <div>
                            <strong>
                              Due soon
                            </strong>

                            <p>
                              {
                                transaction.bookTitle
                              }
                            </p>

                            <span>
                              Due{" "}
                              {
                                transaction.dueDate
                              }
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}

              </div>

            </div>
          )}

        </div>

        <div
          className="navbar-dropdown-wrapper"
          ref={userMenuRef}
        >

          <button
            className="navbar-user"
            onClick={() => {
              setUserMenuOpen(
                (current) =>
                  !current
              );

              setNotificationsOpen(
                false
              );
            }}
          >

            <div className="navbar-avatar">
              {getInitials(
                currentUser?.name
              )}
            </div>

            <div className="navbar-user-info">
              <strong>
                {currentUser?.name}
              </strong>

              <span>
                {formatRole(
                  currentUser?.role
                )}
              </span>
            </div>

            <ChevronDown
              size={15}
            />

          </button>

          {userMenuOpen && (
            <div className="navbar-dropdown user-dropdown">

              <button
                onClick={() => {
                  navigate(
                    "/profile"
                  );

                  setUserMenuOpen(
                    false
                  );
                }}
              >
                <User size={17} />
                My Profile
              </button>

              <div className="dropdown-divider" />

              <button
                className="logout-menu-item"
                onClick={() => {
                  setUserMenuOpen(
                    false
                  );

                  onLogoutRequest();
                }}
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
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

function formatRole(role) {
  if (role === "admin") {
    return "Administrator";
  }

  if (role === "librarian") {
    return "Librarian";
  }

  return "Member";
}

function getDaysUntil(dateString) {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);

  const dueDate =
    new Date(
      year,
      month - 1,
      day
    );

  const difference =
    dueDate.getTime() -
    today.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function getPageTitle(path) {
  if (
    path.startsWith("/books")
  ) {
    return "Books";
  }

  if (
    path.startsWith("/members")
  ) {
    return "Members";
  }

  if (
    path.startsWith(
      "/borrow-return"
    )
  ) {
    return "Borrow / Return";
  }

  if (
    path.startsWith(
      "/transactions"
    )
  ) {
    return "Transactions";
  }

  if (
    path.startsWith("/my-books")
  ) {
    return "My Books";
  }

  if (
    path.startsWith("/profile")
  ) {
    return "My Profile";
  }

  return "Dashboard";
}

export default Navbar;