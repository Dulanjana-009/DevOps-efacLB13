import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowReturn from "./pages/BorrowReturn";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BookDetails from "./pages/BookDetails";
import AddMember from "./pages/AddMember";
import EditMember from "./pages/EditMember";
import MemberDetails from "./pages/MemberDetails";
import Transactions from "./pages/Transactions";
import MyBooks from "./pages/MyBooks";
import Profile from "./pages/Profile";

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* ROOT */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              currentUser
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* BOOKS */}
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Layout>
              <Books />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/add"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <AddBook />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/edit/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <EditBook />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <BookDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* MEMBERS */}
      <Route
        path="/members"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <Members />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/members/add"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <AddMember />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/members/edit/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <EditMember />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/members/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <MemberDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* BORROW / RETURN */}
      <Route
        path="/borrow-return"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <BorrowReturn />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* TRANSACTIONS */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "librarian",
            ]}
          >
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* MEMBER BOOKS */}
      <Route
        path="/my-books"
        element={
          <ProtectedRoute
            allowedRoles={["member"]}
          >
            <Layout>
              <MyBooks />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              currentUser
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;