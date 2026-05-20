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
    { label: "Billing Dashboard" , path: "/receptionist/billing", icon: "💳" },
    { label: "Bills" , path: "/receptionist/bills", icon: "🧾" },
    { label: "payments",path: "/receptionist/payments", icon: "💰" },
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
    { label: "Billing Dashboard", path: "/admin/billing", icon: "💳" },
    { label: "Bills", path: "/admin/bills", icon: "🧾" },
    { label: "Payments", path: "/admin/payments", icon: "💰" },
  ],
};

export default function Layout({ children }) {

  const navigate = useNavigate();

  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

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

      if (refresh) {

        await api.post(
          "/accounts/auth/logout/",
          { refresh }
        );
      }

    } catch {}

    localStorage.clear();

    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-gray-100">

      {/* ===================================== */}
      {/* Sidebar */}
      {/* ===================================== */}

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
          shadow-2xl
          ${collapsed ? "w-20" : "w-72"}
        `}
      >

        {/* Logo */}

        <div
          className={`
            h-20
            border-b
            border-teal-800
            flex
            items-center
            px-4

            ${collapsed
              ? "justify-center"
              : "justify-between"}
          `}
        >

          {!collapsed && (

            <div>

              <h1
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                Hospital
              </h1>

              <p className="text-xs text-teal-300 uppercase tracking-widest mt-1">
                {user.role} Portal
              </p>

            </div>

          )}

          <button
            onClick={toggle}
            className="
              w-10
              h-10
              rounded-xl
              bg-teal-800
              hover:bg-teal-700
              flex
              items-center
              justify-center
              transition-all
            "
          >

            {collapsed ? "▶" : "◀"}

          </button>

        </div>

        {/* User */}

        <div className="px-4 py-5 border-b border-teal-800">

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
              w-12
              h-12
              rounded-full
              bg-teal-700
              flex
              items-center
              justify-center
              font-bold
              text-lg
              shrink-0
            ">

              {user.username?.[0]?.toUpperCase() || "U"}

            </div>

            {!collapsed && (

              <div className="overflow-hidden">

                <h2 className="font-semibold truncate">

                  {user.username}

                </h2>

                <p className="text-sm text-teal-300 capitalize">

                  {user.role}

                </p>

              </div>

            )}

          </div>

        </div>

        {/* Navigation */}

        <nav className="
          flex-1
          overflow-y-auto
          px-3
          py-5
          space-y-2
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
                    : "gap-4"}

                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  font-medium

                  ${
                    active
                      ? "bg-teal-700 text-white shadow-lg"
                      : "text-teal-100 hover:bg-teal-800 hover:text-white"
                  }
                `}
              >

                <span className="text-xl shrink-0">

                  {link.icon}

                </span>

                {!collapsed && (

                  <span className="truncate">

                    {link.label}

                  </span>

                )}

              </Link>

            );
          })}

        </nav>

        {/* Logout */}

        <div className="p-4 border-t border-teal-800">

          <button
            onClick={logout}
            className={`
              w-full
              flex
              items-center

              ${collapsed
                ? "justify-center"
                : "gap-4"}

              px-4
              py-3
              rounded-2xl
              font-medium
              text-teal-100
              hover:bg-red-600
              hover:text-white
              transition-all
            `}
          >

            <span className="text-xl">

              🚪

            </span>

            {!collapsed && (
              <span>Logout</span>
            )}

          </button>

        </div>

      </aside>

      {/* ===================================== */}
      {/* Main Wrapper */}
      {/* ===================================== */}

      <div
        className="
          min-h-screen
          transition-all
          duration-300
        "
        style={{
          marginLeft: collapsed ? "5rem" : "18rem",
        }}
      >

        {/* ===================================== */}
        {/* Topbar */}
        {/* ===================================== */}

        <header className="
          sticky
          top-0
          z-30
          h-20
          bg-white
          border-b
          border-gray-200
          px-8
          flex
          items-center
          justify-between
          shadow-sm
        ">

          {/* Breadcrumb */}

          <div>

            <h1 className="
              text-lg
              font-semibold
              text-gray-700
              capitalize
            ">

              {location.pathname
                .split("/")
                .filter(Boolean)
                .join(" › ")}

            </h1>

          </div>

          {/* User Badge */}

          <div className="flex items-center gap-4">

            <span className="
              hidden
              md:block
              text-sm
              text-gray-500
            ">

              Welcome, {user.username}

            </span>

            <div
              className={`
                px-4
                py-2
                rounded-full
                text-xs
                font-bold
                uppercase
                tracking-wide

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

        {/* ===================================== */}
        {/* Main Content */}
        {/* ===================================== */}

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>
  );
}