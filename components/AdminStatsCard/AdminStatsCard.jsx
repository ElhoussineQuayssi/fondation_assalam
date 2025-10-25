import {
  Newspaper,
  FolderOpen,
  Mail,
  Eye,
  Users,
  CheckCircle,
  FileText,
} from "lucide-react";

const AdminStatsCard = ({ title, value, type }) => {
  let Icon = Mail;

  switch (type) {
    case "articles":
      Icon = Newspaper;
      break;
    case "projects":
      Icon = FolderOpen;
      break;
    case "messages":
      Icon = Mail;
      break;
    case "views":
      Icon = Eye;
      break;
    case "admins":
      Icon = Users;
      break;
    default:
      Icon = CheckCircle;
  }

  return (
    <div
      className="card-lift bg-white p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-l-4"
      style={{ borderColor: "#6495ED" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#B0E0E6" }}
        >
          <Icon className="w-6 h-6" style={{ color: "#6495ED" }} />
        </div>
      </div>
      <div className="mt-4">
        <p
          className="text-3xl font-bold mb-2"
          style={{ color: "#333333" }}
        >
          {value}
        </p>
        <h3 className="text-lg font-medium" style={{ color: "#333333" }}>
          {title}
        </h3>
      </div>
    </div>
  );
};

export default AdminStatsCard;
