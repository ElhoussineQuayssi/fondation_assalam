import { AlertTriangle, Loader2 } from "lucide-react";

const Alert = ({ type, message, className = "" }) => {
  if (!message) return null;

  let classes = `p-4 mb-8 rounded-xl shadow-md flex items-start gap-3 border-l-4 ${className}`;
  let Icon = AlertTriangle;
  let alertStyle = {};
  let iconColor = "#333333";

  if (type === "error") {
    classes += " text-red-800";
    alertStyle = { borderColor: "#EF4444", backgroundColor: "#FEF2F2" };
    iconColor = "#EF4444";
    Icon = AlertTriangle;
  } else if (type === "submitting") {
    classes += ` bg-gray-100`;
    alertStyle = { borderColor: "#6495ED", color: "#333333" };
    iconColor = "#6495ED";
    Icon = Loader2;
  }

  return (
    <div className={classes} style={alertStyle}>
      <Icon
        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${type === "submitting" ? "animate-spin" : ""}`}
        style={{ color: iconColor }}
      />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Alert;
