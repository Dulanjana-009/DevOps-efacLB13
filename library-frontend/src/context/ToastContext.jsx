import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      {children}

      {toast && (
        <div className={`toast ${toast.type}`}>

          <div className="toast-icon">
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>

          <span>{toast.message}</span>

          <button
            onClick={() => setToast(null)}
          >
            <X size={17} />
          </button>

        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}