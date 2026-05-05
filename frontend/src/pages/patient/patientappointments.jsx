import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/appointments/")
      .then((res) => {
        const data = res.data;
        setAppointments(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setError("Failed to load appointments."))
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    "Checked In": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    "No Show": "bg-gray-100 text-gray-600",
  };

  const upcoming = appointments.filter((a) => a.status === "Scheduled" || a.status === "Checked In");
  const past = appointments.filter((a) => a.status === "Completed" || a.status === "Cancelled" || a.status === "No Show");

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-sm text-gray-500 mt-0.5">{appointments.length} total appointments</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-sm">Loading appointments...</div>
        ) : (
          <>
            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Upcoming
                  <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {upcoming.length}
                  </span>
                </h3>
              </div>

              {upcoming.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No upcoming appointments.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Date", "Time", "Doctor", "Department", "Token", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {upcoming.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{a.appointment_date}</td>
                        <td className="px-4 py-3 text-gray-500">{a.appointment_time || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{a.doctor_name || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{a.department || "—"}</td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-700">{a.token_number || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[a.status] || "bg-gray-100 text-gray-600"}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Past */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Past Appointments
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {past.length}
                  </span>
                </h3>
              </div>

              {past.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No past appointments.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Date", "Doctor", "Reason", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {past.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors opacity-80">
                        <td className="px-4 py-3 text-gray-700">{a.appointment_date}</td>
                        <td className="px-4 py-3 text-gray-600">{a.doctor_name || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{a.reason || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[a.status] || "bg-gray-100 text-gray-600"}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
