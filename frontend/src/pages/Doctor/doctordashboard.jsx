import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function DoctorDashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================================
  // Load Dashboard
  // =========================================
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const res = await api.get("/doctorapp/dashboard/");

      console.log("Dashboard Response:", res.data);

      setData(res.data);

    } catch (err) {

      console.log("Dashboard Error:", err);
      console.log("Response:", err?.response);
      console.log("Data:", err?.response?.data);

      alert(
        err?.response?.data?.detail ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // Loading
  // =========================================
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-600 text-lg">
              Loading dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const doctor = data?.doctor || {};
  const stats = data?.stats || {};
  const appointments = data?.today_list || [];

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats.today_appointments || 0,
      icon: "📅",
      color: "bg-blue-600",
    },
    {
      label: "Pending",
      value: stats.today_pending || 0,
      icon: "⏳",
      color: "bg-orange-500",
    },
    {
      label: "Completed",
      value: stats.today_completed || 0,
      icon: "✅",
      color: "bg-green-600",
    },
    {
      label: "Checked In",
      value: stats.checked_in || 0,
      icon: "🏥",
      color: "bg-purple-600",
    },
    {
      label: "Patients",
      value: stats.unique_patients || 0,
      icon: "🧑‍⚕️",
      color: "bg-teal-600",
    },
    {
      label: "Prescriptions",
      value: stats.total_prescriptions || 0,
      icon: "💊",
      color: "bg-pink-600",
    },
  ];

  const statusColors = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    Pending: "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    "Checked In": "bg-blue-100 text-blue-700",
  };

  return (
    <Layout>

      <div className="space-y-6">

        {/* ========================================= */}
        {/* Header Banner */}
        {/* ========================================= */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-blue-200 text-sm mb-1">
              Doctor Portal
            </p>

            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Dr. {doctor.name || "Doctor"}
            </h1>

            <p className="text-blue-200 text-sm mt-2">
              {doctor.department || "Department"}
              {doctor.specialization
                ? ` • ${doctor.specialization}`
                : ""}
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/doctor/profile")}
              className="bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              View Profile
            </button>

            <button
              onClick={() => navigate("/doctor/appointments")}
              className="bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Appointments
            </button>

            <button
              onClick={() => navigate("/doctor/patients")}
              className="bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Patients
            </button>

          </div>

        </div>

        {/* ========================================= */}
        {/* Stat Cards */}
        {/* ========================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

          {statCards.map((card) => (

            <div
              key={card.label}
              className={`${card.color} text-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5`}
            >

              <div className="text-3xl mb-3">
                {card.icon}
              </div>

              <div className="text-3xl font-bold">
                {card.value}
              </div>

              <div className="text-sm opacity-90 mt-1">
                {card.label}
              </div>

            </div>

          ))}

        </div>

        {/* ========================================= */}
        {/* Today's Appointments */}
        {/* ========================================= */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Today's Appointments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {appointments.length} appointment(s) scheduled today
              </p>

            </div>

            <button
              onClick={() => navigate("/doctor/appointments")}
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View All →
            </button>

          </div>

          {/* Empty State */}
          {appointments.length === 0 ? (

            <div className="py-16 text-center text-gray-400">

              <div className="text-5xl mb-4">
                📅
              </div>

              <p className="text-lg">
                No appointments scheduled today
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    {[
                      "Token",
                      "Patient",
                      "Patient ID",
                      "Time",
                      "Status",
                      "Reason",
                    ].map((h) => (

                      <th
                        key={h}
                        className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50">

                  {appointments.map((a) => (

                    <tr
                      key={a.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4 font-bold text-blue-700">
                        {a.token || "—"}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {a.patient_name}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {a.patient_id}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {a.time || "—"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[a.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {a.status}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                        {a.reason || "—"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </Layout>
  );
}