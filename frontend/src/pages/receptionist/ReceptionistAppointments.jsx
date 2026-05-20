import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import Select from "react-select";

export default function ReceptionistAppointments() {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [appointments, setAppointments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = (date) => {
    setLoading(true);
    api.get(`/receptionist/appointments/by-date/?date=${date}`)
      .then((res) => {
        setAppointments(res.data?.results || []);
        setCount(res.data?.count || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(selectedDate); }, [selectedDate]);

  const checkIn = async (id) => {
    setActionLoading(`checkin-${id}`);
    try {
      await api.post(`/receptionist/check-in/${id}/`);
      fetchAppointments(selectedDate);
    } catch (err) {
      alert(err?.response?.data?.error || "Check-in failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const generateToken = async (id) => {
    setActionLoading(`token-${id}`);
    try {
      await api.post(`/receptionist/generate-token/${id}/`);
      fetchAppointments(selectedDate);
    } catch (err) {
      alert(err?.response?.data?.error || "Token generation failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    "Checked In": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    "No Show": "bg-gray-100 text-gray-600",
  };

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {count} appointment{count !== 1 ? "s" : ""} on {selectedDate === todayStr ? "today" : selectedDate}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
            />
            <button
              onClick={() => navigate("/receptionist/appointments/create")}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              + New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Token", "Time", "Patient", "Doctor", "Reason", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    No appointments found for this date.
                  </td>
                </tr>
              ) : appointments.map((ap) => (
                <tr key={ap.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-teal-700 font-bold text-sm">
                    {ap.token_number || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ap.appointment_time || "—"}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{ap.patient_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ap.doctor_name}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{ap.reason || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[ap.status] || "bg-gray-100 text-gray-600"}`}>
                      {ap.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!ap.token_number && (
                        <button
                          onClick={() => generateToken(ap.id)}
                          disabled={actionLoading === `token-${ap.id}`}
                          className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-200 transition-colors font-medium disabled:opacity-50"
                        >
                          {actionLoading === `token-${ap.id}` ? "..." : "Token"}
                        </button>
                      )}
                      {ap.status === "Scheduled" && (
                        <button
                          onClick={() => checkIn(ap.id)}
                          disabled={actionLoading === `checkin-${ap.id}`}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium disabled:opacity-50"
                        >
                          {actionLoading === `checkin-${ap.id}` ? "..." : "Check In"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
