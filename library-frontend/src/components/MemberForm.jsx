import { useState } from "react";

function MemberForm({
  initialData,
  onSubmit,
  onCancel,
  submitText,
}) {
  const [formData, setFormData] =
    useState({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      username:
        initialData?.username || "",
      password: "",
    });

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      className="professional-form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">

        <div className="form-group">
          <label>Full Name *</label>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>

          <input
            type="email"
            name="email"
            placeholder="member@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username *</label>

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
          <label>
            {initialData
              ? "New Password"
              : "Temporary Password *"}
          </label>

          <input
            type="password"
            name="password"
            placeholder={
              initialData
                ? "Leave blank to keep current password"
                : "Minimum 6 characters"
            }
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required={!initialData}
          />

          {initialData && (
            <small>
              Leave blank if you don't want
              to change the member's password.
            </small>
          )}
        </div>

      </div>

      <div className="form-footer">

        <button
          type="button"
          className="button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-action-button"
        >
          {submitText}
        </button>

      </div>
    </form>
  );
}

export default MemberForm;