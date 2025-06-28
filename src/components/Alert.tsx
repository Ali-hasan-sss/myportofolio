import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { useState } from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

export default function Alert({
  type,
  title,
  message,
  onClose,
  dismissible = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const alertStyles = {
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: CheckCircle,
      iconColor: "text-green-500",
      textColor: "text-green-400",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: XCircle,
      iconColor: "text-red-500",
      textColor: "text-red-400",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: AlertCircle,
      iconColor: "text-yellow-500",
      textColor: "text-yellow-400",
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: Info,
      iconColor: "text-blue-500",
      textColor: "text-blue-400",
    },
  };

  const style = alertStyles[type];
  const Icon = style.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`${style.bg} ${style.border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 mr-3`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-medium ${style.textColor} mb-1`}>{title}</h3>
          )}
          <p className={`${style.textColor} text-sm`}>{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className={`${style.textColor} hover:opacity-75 transition-opacity duration-200 ml-3`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
