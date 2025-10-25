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
  LogOut,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ user }) => {
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

  const currentPath = pathname.split("/").slice(0, 3).join("/");

  const filteredNavItems = navItems.filter((item) => {
    return item.permission.includes(user?.role);
  });

  return (
    <aside
      className="w-64 shadow-lg h-screen sticky top-0 border-r border-gray-100 transition-all duration-300"
      style={{ backgroundColor: "white" }}
    >
      <div
        className="p-8 border-b border-gray-100"
        style={{ backgroundColor: "white" }}
      >
        <Link
          href="/admin/dashboard"
          className="text-2xl font-bold hover:text-accent transition-colors duration-200"
          style={{ color: "#333333" }}
        >
          Admin Assalam
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          Bonjour, {user?.name || "Admin"}
        </p>
      </div>

      <nav className="mt-8">
        <ul className="space-y-1 px-4">
          {filteredNavItems.map((item, index) => {
            const isActive =
              currentPath === item.href ||
              (item.href === "/admin/blogs" &&
                pathname.startsWith("/admin/blogs"));
            const linkStyle = isActive
              ? { backgroundColor: "#6495ED", color: "white" }
              : { color: "#333333" };

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium text-base
                    focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50
                    ${
                      isActive
                        ? "shadow-lg transform translate-x-1"
                        : "hover:bg-gray-100 hover:shadow-md hover:translate-x-1 card-lift"
                    }`}
                  style={{ ...linkStyle, animationDelay: `${index * 0.1}s` }}
                >
                  <span
                    className={`mr-4 transition-all duration-300 ${
                      isActive ? "text-white" : "group-hover:scale-110"
                    }`}
                    style={{ color: isActive ? "white" : "#6495ED" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              </li>
            );
          })}

          <li className="pt-8 border-t border-gray-100 mt-8">
            <Link
              href="/"
              className="group flex items-center px-4 py-3 hover:bg-gray-100 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50 card-lift scroll-reveal"
              style={{ color: "#6495ED" }}
            >
              <Home className="h-5 w-5 mr-4 transition-transform group-hover:scale-110 duration-300" />
              <span className="text-base">Retour à l'accueil</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="pt-4 mt-4 border-t border-gray-100 px-4">
        <Link
          href="/api/auth/logout"
          className="flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
