import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const NAV_LINKS = {
  doctor: [
    { label: "Dashboard", path: "/doctor/dashboard", icon: "🏠" },
    { label: "Appointments", path: "/doctor/appointments", icon: "📅" },
    { label: "Profile", path: "/doctor/profile", icon: "👤" },
  ],

  receptionist: [
    { label: "Dashboard", path: "/receptionist/dashboard", icon: "🏠" },
    { label: "Patients", path: "/receptionist/patients", icon: "🧑‍⚕️" },
    { label: "Appointments", path: "/receptionist/appointments", icon: "📅" },
    { label: "Create Appointment", path: "/receptionist/appointments/create", icon: "➕" },
    { label: "Walk-In", path: "/receptionist/walkin", icon: "🚶" },
    { label: "Visitor Log", path: "/receptionist/visitors", icon: "📋" },
  ],

  patient: [
    { label: "Dashboard", path: "/patient/dashboard", icon: "🏠" },
    { label: "My Profile", path: "/patient/profile", icon: "👤" },
    { label: "Appointments", path: "/patient/appointments", icon: "📅" },
    { label: "Prescriptions", path: "/patient/prescriptions", icon: "💊" },
    { label: "Medical Records", path: "/patient/records", icon: "📁" },
    { label: "Feedback", path: "/patient/feedback", icon: "⭐" },
    { label: "Support", path: "/patient/tickets", icon: "🎫" },
  ],

  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { label: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
    { label: "Patients", path: "/admin/patients", icon: "🧑‍⚕️" },
    { label: "Receptionists", path: "/admin/receptionists", icon: "🧑‍💼" },
    { label: "Appointments", path: "/admin/appointments", icon: "📅" },
    { label: "Departments", path: "/admin/departments", icon: "🏥" },
    { label: "Activity Logs", path: "/admin/logs", icon: "📊" },
  ],
};

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const links = NAV_LINKS[user.role] || [];

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar_collapsed") === "true"
  );

  const toggle = () => {
    const next = !collapsed;

    setCollapsed(next);

    localStorage.setItem(
      "sidebar_collapsed",
      String(next)
    );
  };

  const logout = async () => {
    try {
      const refresh =
        localStorage.getItem("refresh_token");

      await api.post(
        "/accounts/auth/logout/",
        { refresh }
      );
    } catch {}

    localStorage.clear();

    navigate("/login");
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          z-40
          bg-teal-900
          text-white
          flex
          flex-col
          transition-all
          duration-300
          ${collapsed ? "w-16" : "w-64"}
        `}
      >

        {/* Logo */}
        <div
          className={`
            px-3
            py-4
            border-b
            border-teal-700
            flex
            items-center
            ${collapsed
              ? "justify-center"
              : "justify-between"}
          `}
        >

          {!collapsed && (
            <div>
              <div
                className="text-xl font-bold"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                Hospital
              </div>

              <div className="text-[10px] text-teal-400 uppercase tracking-widest capitalize">
                {user.role} Portal
              </div>
            </div>
          )}

          <button
            onClick={toggle}
            className="
              w-8
              h-8
              rounded-lg
              bg-teal-700
              hover:bg-teal-600
              flex
              items-center
              justify-center
              transition-colors
            "
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* User */}
        <div className="px-3 py-4 border-b border-teal-700">

          <div
            className={`
              flex
              items-center
              ${collapsed
                ? "justify-center"
                : "gap-3"}
            `}
          >

            <div className="
              w-10
              h-10
              rounded-full
              bg-teal-600
              flex
              items-center
              justify-center
              font-bold
            ">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>

            {!collapsed && (
              <div>
                <div className="font-semibold text-sm">
                  {user.username}
                </div>

                <div className="text-xs text-teal-300 capitalize">
                  {user.role}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="
          flex-1
          overflow-y-auto
          px-2
          py-4
          space-y-1
        ">

          {links.map((link) => {
            const active =
              location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                title={collapsed ? link.label : ""}
                className={`
                  flex
                  items-center
                  ${collapsed
                    ? "justify-center"
                    : "gap-3"}
                  px-3
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all

                  ${
                    active
                      ? "bg-teal-700 text-white"
                      : "text-teal-200 hover:bg-teal-800 hover:text-white"
                  }
                `}
              >

                <span className="text-lg">
                  {link.icon}
                </span>

                {!collapsed && (
                  <span>
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-teal-700">

          <button
            onClick={logout}
            className={`
              w-full
              flex
              items-center
              ${collapsed
                ? "justify-center"
                : "gap-3"}
              px-3
              py-3
              rounded-xl
              text-sm
              font-medium
              text-teal-200
              hover:bg-red-600
              hover:text-white
              transition-all
            `}
          >

            <span className="text-lg">
              🚪
            </span>

            {!collapsed && (
              <span>
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div
        className={`
          flex-1
          min-w-0
          transition-all
          duration-300
          min-h-screen
          ${collapsed ? "ml-16" : "ml-64"}
        `}
      >

        {/* Topbar */}
        <header className="
          sticky
          top-0
          z-30
          bg-white
          border-b
          border-gray-200
          px-6
          py-4
          flex
          items-center
          justify-between
        ">

          <div className="flex items-center gap-3">

            <button
              onClick={toggle}
              className="
                lg:hidden
                w-8
                h-8
                rounded-lg
                border
                border-gray-200
                flex
                items-center
                justify-center
              "
            >
              ☰
            </button>

            <h1 className="
              text-sm
              font-semibold
              text-gray-600
              capitalize
            ">
              {location.pathname
                .split("/")
                .filter(Boolean)
                .join(" › ")}
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <span className="
              hidden
              md:block
              text-sm
              text-gray-500
            ">
              👋 {user.username}
            </span>

            <div
              className={`
                text-xs
                px-3
                py-1
                rounded-full
                font-semibold
                capitalize

                ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "doctor"
                    ? "bg-teal-100 text-teal-700"
                    : user.role === "receptionist"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }
              `}
            >
              {user.role}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}