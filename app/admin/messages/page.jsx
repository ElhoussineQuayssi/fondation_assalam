"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMessages, deleteMessage, markMessageAsRead } from "lib/actions";
import {
  Mail,
  Star,
  Trash2,
  Inbox,
  CheckCircle,
  Eye,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// Import extracted components
import AdminPageHeader from "@/components/AdminPageHeader/AdminPageHeader.jsx";
import AdminStatsCard from "@/components/AdminStatsCard/AdminStatsCard.jsx";
import AdminActionButtons from "@/components/AdminActionButtons/AdminActionButtons.jsx";
import AdminTable from "@/components/AdminTable/AdminTable.jsx";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const BACKGROUND = "#FAFAFA"; // Off-White

// --- Main Component ---
export default function MessagesAdmin() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({}); // Track loading state for each action

  const refreshMessages = async () => {
    setLoading(true);
    const result = await getMessages();
    if (result.success) {
      setMessages(result.data);

      const total = result.data.length;
      const unread = result.data.filter((m) => m.status === "unread").length;
      const read = total - unread;
      setStats({ total, unread, read });
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshMessages();
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.",
      )
    )
      return;

    // Set loading state for this specific delete action
    setLoadingActions(prev => ({ ...prev, [`delete-${id}`]: true }));

    const result = await deleteMessage(id);
    if (result.success) {
      // Update local state immediately
      const deletedMessage = messages.find((m) => m.id === id);
      setMessages(messages.filter((m) => m.id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        unread:
          deletedMessage?.status === "unread"
            ? prev.unread - 1
            : prev.unread,
        read:
          deletedMessage?.status === "read"
            ? prev.read - 1
            : prev.read,
      }));
    } else {
      console.error("Delete failed:", result.message);
      alert("Erreur lors de la suppression: " + result.message);
    }

    // Remove loading state for this specific delete action
    setLoadingActions(prev => ({ ...prev, [`delete-${id}`]: false }));
  };

  const handleMarkAsRead = async (id) => {
    // Set loading state for this specific markAsRead action
    setLoadingActions(prev => ({ ...prev, [`markAsRead-${id}`]: true }));

    const result = await markMessageAsRead(id);
    if (result.success) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status: "read" } : m)),
      );
      setStats((prev) => ({
        ...prev,
        unread: prev.unread - 1,
        read: prev.read + 1,
      }));
    } else {
      console.error("Mark as read failed:", result.message);
    }

    // Remove loading state for this specific markAsRead action
    setLoadingActions(prev => ({ ...prev, [`markAsRead-${id}`]: false }));
  };

  const columns = [
    {
      key: "name",
      render: (value, item) => (
        <div>
          <p
            className={`font-semibold text-sm ${item.status === "unread" ? `text-[${ACCENT}]` : `text-[${DARK_TEXT}]`}`}
          >
            {value}
          </p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Téléphone",
      render: (value) => value || "N/A",
    },
    {
      key: "type",
      label: "Type",
      render: (value) => {
        let typeText = value;
        if (value === "donation") typeText = "Don";
        if (value === "volunteer") typeText = "Bénévole";
        if (value === "contact") typeText = "Contact";

        return (
          // Unified Accent Badge Style
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[${ACCENT}/10] text-[${ACCENT}]`}
          >
            {typeText}
          </span>
        );
      },
    },
    {
      key: "message",
      label: "Message",
      render: (value) => (
        <p className="text-xs text-gray-600 truncate max-w-xs leading-tight">{value}</p>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
  ];

  const actionButtons = [
    {
      key: "markAsRead",
      icon: CheckCircle, // Changed icon for 'Mark as Read' to be clearer
      onClick: handleMarkAsRead,
      className: `text-green-600 hover:text-green-800`, // Use a subtle green for read status
      title: "Marquer comme lu",
    },
    {
      key: "view",
      icon: Eye,
      href: (item) => `/admin/messages/${item.id}`,
      className: `text-gray-600 hover:text-[${ACCENT}]`,
      title: "Voir détails",
    },
    {
      key: "delete",
      icon: Trash2,
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-800",
      title: "Supprimer",
    },
  ];

  return (
    // Main canvas background
    <main className={`bg-[${BACKGROUND}] min-h-screen py-10 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader title="Gestion des Messages" />

        {/* Stats Cards - Blueprint responsive grid pattern with ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 scroll-reveal">
          <AdminStatsCard title="Total" value={stats.total} type="total" />
          <AdminStatsCard title="Non lus" value={stats.unread} type="unread" />
          <AdminStatsCard title="Lus" value={stats.read} type="read" />
        </div>

        <div className="scroll-reveal">
          <AdminTable
            columns={columns}
            data={messages}
            renderActions={(item) => (
              <AdminActionButtons
                item={item}
                actions={actionButtons}
                loadingActions={loadingActions}
              />
            )}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
