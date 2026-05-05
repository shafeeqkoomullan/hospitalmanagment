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

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      await api.post("/accounts/auth/logout/", { refresh });
    } catch {}
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 text-white flex flex-col fixed h-full z-40">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-teal-700">
          <div className="text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Hospital
          </div>
          <div className="text-xs text-teal-400 uppercase tracking-widest mt-0.5 capitalize">
            {user.role} Portal
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-teal-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user.username}</div>
              <div className="text-xs text-teal-400 capitalize">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-teal-700 text-white"
                    : "text-teal-200 hover:bg-teal-800 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-teal-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-teal-200 hover:bg-red-600 hover:text-white transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-sm font-semibold text-gray-600 capitalize">
            {location.pathname.split("/").filter(Boolean).join(" › ")}
          </h1>
          <span className="text-sm text-gray-400">👋 {user.username}</span>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}