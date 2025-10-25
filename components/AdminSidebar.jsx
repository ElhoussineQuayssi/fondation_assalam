/**
 * AdminSidebar component - Transformed using foundation-blueprint.html design system
 * Navigation sidebar with blueprint-compliant styling and role-based filtering
 * @param {Object} props - Component properties
 * @param {Object} props.user - The user object containing the role
 * @returns {JSX.Element} Transformed admin sidebar with blueprint patterns
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  MessageSquare,
  Users,
  LayoutDashboard,
  FolderOpen,
  Home,
} from "lucide-react";

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      permission: ["super_admin", "content_manager", "message_manager"],
    },
    {
      name: "Articles",
      href: "/admin/blogs",
      icon: <Newspaper className="h-5 w-5" />,
      permission: ["super_admin", "content_manager"],
    },
    {
      name: "Projets",
      href: "/admin/projects",
      icon: <FolderOpen className="h-5 w-5" />,
      permission: ["super_admin", "content_manager"],
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      permission: ["super_admin", "message_manager"],
    },
    {
      name: "Administrateurs",
      href: "/admin/admins",
      icon: <Users className="h-5 w-5" />,
      permission: ["super_admin"],
    },
  ];

  // Functionality Preservation: Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (user?.role === "content_manager") {
      // content_manager: show dashboard, articles, and projects
      return (
        item.name === "Tableau de Bord" ||
        item.name === "Articles" ||
        item.name === "Projets"
      );
    } else if (user?.role === "message_manager") {
      // messages_manager: show dashboard and messages only
      return item.name === "Tableau de Bord" || item.name === "Messages";
    } else if (user?.role === "super_admin") {
      // super_admin: show all
      return true;
    }
    // default: no access
    return false;
  });

  return (
    // Sidebar design using blueprint patterns: light background with card-lift effects
    <aside className="w-64 bg-background shadow-lg h-screen sticky top-0 border-r border-gray-100">
      {/* Header/Logo Section - Blueprint typography: text-2xl font-bold for logos */}
      <div className="p-8 border-b border-gray-100 bg-background">
        <Link
          href="/admin/dashboard"
          className="text-2xl font-bold text-dark-text hover:text-accent transition-colors duration-200"
        >
          Admin Assalam
        </Link>
      </div>

      <nav className="mt-8">
        <ul className="space-y-1 px-4">
          {filteredNavItems.map((item, index) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium text-base
                  focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50
                  ${
                    // Active State: Accent background with white text, enhanced shadow
                    pathname === item.href
                      ? "bg-accent text-white shadow-lg transform translate-x-1"
                      : // Default/Hover State: Dark text, hover with primary-light background and card-lift effect
                        "text-dark-text hover:bg-primary-light/70 hover:shadow-md hover:translate-x-1 card-lift"
                  }
                  scroll-reveal`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon Styling: White on active, accent on default, scale on hover */}
                <span
                  className={`mr-4 transition-all duration-300 ${
                    pathname === item.href
                      ? "text-white"
                      : "text-accent group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Home Link - Enhanced with blueprint button styling */}
          <li className="pt-8 border-t border-gray-100 mt-8">
            <Link
              href="/"
              className="group flex items-center px-4 py-3 text-accent hover:bg-primary-light/70 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50 card-lift scroll-reveal"
            >
              <Home className="h-5 w-5 mr-4 transition-transform group-hover:scale-110 duration-300" />
              <span className="text-base">Retour à l'accueil</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
