import {
  AlertTriangle,
  X,
} from "lucide-react";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="confirm-modal">

        <div className="modal-top">

          <div className="warning-icon">
            <AlertTriangle size={23} />
          </div>

          <button
            className="modal-close"
            onClick={onCancel}
          >
            <X size={19} />
          </button>

        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">

          <button
            className="button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="button-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;