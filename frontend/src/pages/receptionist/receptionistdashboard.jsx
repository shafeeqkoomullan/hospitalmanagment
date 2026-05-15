import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/receptionist/dashboard/")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Today's Appointments",
      value: data?.total_appointments ?? 0,
      color: "bg-teal-600",
      icon: "📅",
      path: "/receptionist/appointments",
    },
    {
      label: "Checked In",
      value: data?.checked_in ?? 0,
      color: "bg-green-600",
      icon: "✅",
      path: "/receptionist/appointments",
    },
    {
      label: "Walk-Ins",
      value: data?.walkins ?? 0,
      color: "bg-blue-600",
      icon: "🚶",
      path: "/receptionist/walkin",
    },
    {
      label: "Visitors",
      value: data?.visitors ?? 0,
      color: "bg-purple-600",
      icon: "👥",
      path: "/receptionist/visitors",
    },
  ];

  const actions = [
    {
      label: "📅 Today's Appointments",
      path: "/receptionist/appointments",
      color:
        "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100",
    },
    {
      label: "➕ New Appointment",
      path: "/receptionist/appointments/create",
      color:
        "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    },
    {
      label: "🧑‍⚕️ Register Patient",
      path: "/receptionist/patients/register",
      color:
        "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },
    {
      label: "🚶 Walk-In",
      path: "/receptionist/walkin",
      color:
        "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
    },
    {
      label: "📋 Visitor Log",
      path: "/receptionist/visitors",
      color:
        "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100",
    },
    {
      label: "👥 All Patients",
      path: "/receptionist/patients",
      color:
        "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-6 text-white shadow-md">
          <p className="text-teal-200 text-sm mb-1">
            Today's Overview
          </p>

          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Receptionist Dashboard
          </h2>

          <p className="text-teal-200 text-sm mt-2">
            {new Date().toDateString()}
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {stats.map((s) => (
              <button
                key={s.label}
                onClick={() => navigate(s.path)}
                className={`${s.color} flex-1 min-w-[220px] text-white rounded-xl p-5 text-left hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="text-3xl mb-2">
                  {s.icon}
                </div>

                <div className="text-3xl font-bold">
                  {s.value}
                </div>

                <div className="text-sm opacity-90 mt-1">
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-3">
            {actions.map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`${a.color} flex-1 min-w-[220px] border rounded-lg px-4 py-3 text-sm font-medium transition-all text-left`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}