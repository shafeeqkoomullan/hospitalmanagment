import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchAppointments = (d, s) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (d) params.set("date", d);
    if (s) params.set("status", s);
    api.get(`/admin-panel/appointments/?${params}`)
      .then((res) => setAppointments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(date, statusFilter); }, [date, statusFilter]);

  const statusColors = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    "Checked In": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    "No Show": "bg-gray-100 text-gray-600",
  };

  const filtered = appointments.filter((a) =>
    (a.patient || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.doctor || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
          <p className="text-sm text-gray-500 mt-0.5">{appointments.length} appointments found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          >
            <option value="">All Statuses</option>
            {["Scheduled", "Checked In", "Completed", "Cancelled", "No Show"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {(date || statusFilter) && (
            <button
              onClick={() => { setDate(""); setStatusFilter(""); }}
              className="border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Token", "Patient", "Doctor", "Date", "Time", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Loading appointments...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No appointments found.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">{a.token || "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{a.patient}</td>
                  <td className="px-4 py-3 text-gray-600">{a.doctor}</td>
                  <td className="px-4 py-3 text-gray-600">{a.date}</td>
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
      </div>
    </Layout>
  );
}
