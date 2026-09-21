import {
  User,
  Mail,
  Phone,
  AtSign,
  ShieldCheck,
  KeyRound,
  Save,
} from "lucide-react";

import { useState } from "react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useToast,
} from "../context/ToastContext";

function Profile() {
  const {
    currentUser,
    updateOwnProfile,
    changePassword,
  } = useAuth();

  const { showToast } = useToast();

  const [profileData, setProfileData] =
    useState({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      username:
        currentUser?.username || "",
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const handleProfileChange = (event) => {
    const { name, value } =
      event.target;

    setProfileData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (
    event
  ) => {
    event.preventDefault();

    const result =
      updateOwnProfile(profileData);

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      "Profile updated successfully.",
      "success"
    );
  };

  const handlePasswordSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      showToast(
        "New passwords do not match.",
        "error"
      );

      return;
    }

    const result = changePassword({
      currentPassword:
        passwordData.currentPassword,

      newPassword:
        passwordData.newPassword,
    });

    if (!result.success) {
      showToast(
        result.message,
        "error"
      );

      return;
    }

    showToast(
      "Password changed successfully.",
      "success"
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>

      <div className="page-title-section">
        <div>
          <h1>My Profile</h1>

          <p>
            Manage your account information
            and security settings.
          </p>
        </div>
      </div>

      <div className="profile-header-card">

        <div className="profile-large-avatar">
          {getInitials(
            currentUser.name
          )}
        </div>

        <div className="profile-header-info">
          <h2>{currentUser.name}</h2>

          <p>
            {formatRole(
              currentUser.role
            )}
          </p>

          <div className="profile-tags">

            <span>
              <User size={13} />
              {currentUser.id}
            </span>

            <span>
              <ShieldCheck size={13} />
              Active Account
            </span>

          </div>
        </div>

      </div>

      <div className="profile-layout">

        <section className="profile-section-card">

          <div className="profile-section-heading">

            <div className="form-heading-icon">
              <User size={21} />
            </div>

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Update your account
                details.
              </p>
            </div>

          </div>

          <form
            onSubmit={
              handleProfileSubmit
            }
          >

            <div className="form-group">

              <label>Account ID</label>

              <div className="input-with-icon disabled-input">
                <User size={17} />

                <input
                  type="text"
                  value={currentUser.id}
                  disabled
                />
              </div>

            </div>

            <div className="form-group">

              <label>Role</label>

              <div className="input-with-icon disabled-input">
                <ShieldCheck
                  size={17}
                />

                <input
                  type="text"
                  value={formatRole(
                    currentUser.role
                  )}
                  disabled
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Full Name *
              </label>

              <div className="input-with-icon">
                <User size={17} />

                <input
                  type="text"
                  name="name"
                  value={
                    profileData.name
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Email Address *
              </label>

              <div className="input-with-icon">
                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  value={
                    profileData.email
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <div className="input-with-icon">
                <Phone size={17} />

                <input
                  type="tel"
                  name="phone"
                  value={
                    profileData.phone
                  }
                  onChange={
                    handleProfileChange
                  }
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Username *
              </label>

              <div className="input-with-icon">
                <AtSign size={17} />

                <input
                  type="text"
                  name="username"
                  value={
                    profileData.username
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="primary-action-button"
            >
              <Save size={17} />
              Save Changes
            </button>

          </form>

        </section>

        <section className="profile-section-card">

          <div className="profile-section-heading">

            <div className="form-heading-icon">
              <KeyRound size={21} />
            </div>

            <div>
              <h2>
                Change Password
              </h2>

              <p>
                Update your account
                password.
              </p>
            </div>

          </div>

          <form
            onSubmit={
              handlePasswordSubmit
            }
          >

            <div className="form-group">
              <label>
                Current Password *
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordData.currentPassword
                }
                onChange={
                  handlePasswordChange
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                New Password *
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordData.newPassword
                }
                onChange={
                  handlePasswordChange
                }
                minLength="6"
                required
              />

              <small>
                Minimum 6 characters.
              </small>
            </div>

            <div className="form-group">
              <label>
                Confirm New Password *
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  passwordData.confirmPassword
                }
                onChange={
                  handlePasswordChange
                }
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-action-button"
            >
              <KeyRound size={17} />
              Change Password
            </button>

          </form>

        </section>

      </div>

    </div>
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

export default Profile;