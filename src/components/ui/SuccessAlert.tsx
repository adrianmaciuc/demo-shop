import { X, CheckCircle } from "lucide-react";

interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const SuccessAlert = ({
  message,
  onDismiss,
  className = "",
}: SuccessAlertProps) => {
  return (
    <div
      className={`p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
