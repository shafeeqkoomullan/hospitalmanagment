import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const fetchDashboard = (d) => {
    setLoading(true);
    api.get(`/admin-panel/dashboard/${d ? `?date=${d}` : ""}`)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDashboard(date); }, [date]);

  const statCards = [
    { label: "Doctors", value: data?.totals?.doctors ?? 0, icon: "👨‍⚕️", color: "bg-teal-600", path: "/admin/doctors" },
    { label: "Patients", value: data?.totals?.patients ?? 0, icon: "🧑‍⚕️", color: "bg-blue-600", path: "/admin/patients" },
    { label: "Receptionists", value: data?.totals?.receptionists ?? 0, icon: "🧑‍💼", color: "bg-purple-600", path: "/admin/receptionists" },
    { label: "Appointments", value: data?.totals?.appointments ?? 0, icon: "📅", color: "bg-orange-500", path: "/admin/appointments" },
    { label: "Departments", value: data?.totals?.departments ?? 0, icon: "🏥", color: "bg-green-600", path: "/admin/departments" },
  ];

  const statusColors = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    "Checked In": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-300 text-sm mb-1">Hospital Management</p>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
              Admin Dashboard
            </h2>
            <p className="text-teal-300 text-sm mt-1">{new Date().toDateString()}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/doctors/create")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              + Add Doctor
            </button>
            <button
              onClick={() => navigate("/admin/receptionists/create")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              + Add Receptionist
            </button>
          </div>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="text-gray-400 text-sm">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statCards.map((s) => (
                <button
                  key={s.label}
                  onClick={() => navigate(s.path)}
                  className={`${s.color} text-white rounded-xl p-5 text-left hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs opacity-90 mt-1">{s.label}</div>
                </button>
              ))}
            </div>

            {/* Today's appointments */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-gray-800">Appointments</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {data?.today_appointments_count || 0} appointments on selected date
                  </p>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              {!data?.appointments?.length ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No appointments on this date.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Token", "Patient", "Doctor", "Time", "Status"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.appointments.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-teal-700">{a.token || "—"}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{a.patient}</td>
                          <td className="px-4 py-3 text-gray-600">{a.doctor}</td>
                          <td className="px-4 py-3 text-gray-500">{a.time || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[a.status] || "bg-gray-100 text-gray-600"}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent activity */}
            {data?.recent_activity?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Recent Activity</h3>
                  <button
                    onClick={() => navigate("/admin/logs")}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.recent_activity.map((log, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {log.user__username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="text-gray-700">
                          <span className="font-medium">{log.user__username}</span>
                          {" "}<span className="text-gray-400">{log.action}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {log.timestamp?.slice(0, 16).replace("T", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
