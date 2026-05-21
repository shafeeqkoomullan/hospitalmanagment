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
  const [pendingBills, setPendingBills] = useState([]);
  const [completedBills, setCompletedBills] = useState([]);

  const fetchAppointments = (date) => {
    setLoading(true);
    api.get(`/receptionist/appointments/by-date/?date=${date}`)
      .then((res) => {
        setAppointments(res.data?.results || []);
        setCount(res.data?.count || 0);
        // Filter appointments into pending and completed bills
        const pending = (res.data?.results || []).filter(
          (apt) => apt.status === "Completed" && !apt.bill_generated
        );
        const completed = (res.data?.results || []).filter(
          (apt) => apt.status === "Completed" && apt.bill_generated
        );
        setPendingBills(pending);
        setCompletedBills(completed);
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

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
              Today's Appointments
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Manage check-ins and tokens
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-sm">No appointments for this date</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Patient", "Doctor", "Time", "Status", "Token", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((ap) => (
                    <tr key={ap.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4 font-semibold text-gray-800">{ap.patient_name}</td>
                      <td className="px-5 py-4 text-gray-600">Dr. {ap.doctor_name}</td>
                      <td className="px-5 py-4 text-gray-500">{ap.time}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ap.status] || "bg-gray-100 text-gray-600"}`}>
                          {ap.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-teal-700">
                        {ap.token ? `#${ap.token}` : "—"}
                      </td>
                      <td className="px-5 py-4 flex gap-2">
                        {ap.status === "Scheduled" && (
                          <button
                            onClick={() => checkIn(ap.id)}
                            disabled={actionLoading === `checkin-${ap.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium disabled:opacity-50"
                          >
                            {actionLoading === `checkin-${ap.id}` ? "..." : "Check In"}
                          </button>
                        )}
                        {ap.status === "Checked In" && !ap.token && (
                          <button
                            onClick={() => generateToken(ap.id)}
                            disabled={actionLoading === `token-${ap.id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg transition-all font-medium disabled:opacity-50"
                          >
                            {actionLoading === `token-${ap.id}` ? "..." : "Generate Token"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Billing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
              Pending Billing
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Completed consultations awaiting billing
            </p>
          </div>

          {pendingBills.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-sm">No pending bills</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Patient", "Doctor", "Token", "Time", "Action"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingBills.map((ap) => (
                    <tr key={ap.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4 font-semibold text-gray-800">{ap.patient_name}</td>
                      <td className="px-5 py-4 text-gray-600">Dr. {ap.doctor_name}</td>
                      <td className="px-5 py-4 font-mono font-bold text-teal-700">#{ap.token}</td>
                      <td className="px-5 py-4 text-gray-500">{ap.time}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => navigate(`/receptionist/bills/create/${ap.id}`)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2 rounded-xl transition-all font-medium"
                        >
                          Create Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Completed Billing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
              Completed Billing
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Consultations with generated bills
            </p>
          </div>

          {completedBills.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No completed bills
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Patient", "Doctor", "Token", "Time", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {completedBills.map((ap) => (
                    <tr key={ap.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4 font-semibold text-gray-800">{ap.patient_name}</td>
                      <td className="px-5 py-4 text-gray-600">Dr. {ap.doctor_name}</td>
                      <td className="px-5 py-4 font-mono font-bold text-teal-700">#{ap.token}</td>
                      <td className="px-5 py-4 text-gray-500">{ap.time}</td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Billed
                        </span>
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