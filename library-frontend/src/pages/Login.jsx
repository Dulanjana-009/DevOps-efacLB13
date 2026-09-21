import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const success = login(
      formData.username,
      formData.password
    );

    if (!success) {
      setError(
        "Invalid username or password."
      );

      return;
    }

    navigate("/");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          📚
        </div>

        <h1>LibraryMS</h1>

        <p className="login-subtitle">
          Library Management System
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            Sign In
          </button>

        </form>

        <div className="register-link">
          New member?{" "}

          <Link to="/register">
            Create an account
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;