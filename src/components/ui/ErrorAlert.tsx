import { X } from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert = ({ error, onDismiss, className = "" }: ErrorAlertProps) => {
  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{error}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
