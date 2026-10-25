import { CheckCircle2, XCircle, X } from "lucide-react";
import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div
      className={`trip-toast ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="trip-toast-icon">
        {type === "success" ? (
          <CheckCircle2 size={23} />
        ) : (
          <XCircle size={23} />
        )}
      </div>

      <div className="trip-toast-content">
        <strong>
          {type === "success" ? "Success!" : "Something went wrong"}
        </strong>

        <p>{message}</p>
      </div>

      <button
        type="button"
        className="trip-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;