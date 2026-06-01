import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: "", action: "", model: "" });

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.role) params.set("role", filter.role);
    if (filter.action) params.set("action", filter.action);
    if (filter.model) params.set("model", filter.model);
    api.get(`/core/logs/?${params}`)
      .then((res) => setLogs(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [filter]);

  const actionColors = {
    create: "bg-green-100 text-green-700",
    update: "bg-blue-100 text-blue-700",
    delete: "bg-red-100 text-red-700",
    login: "bg-teal-100 text-teal-700",
    logout: "bg-gray-100 text-gray-600",
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    doctor: "bg-teal-100 text-teal-700",
    receptionist: "bg-blue-100 text-blue-700",
    patient: "bg-orange-100 text-orange-700",
  };

  const clearFilters = () => setFilter({ role: "", action: "", model: "" });
  const hasFilters = filter.role || filter.action || filter.model;

  return (
    <Layout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Activity Logs</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {logs.length} log{logs.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filter.role}
            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          >
            <option value="">All Roles</option>
            {["admin", "doctor", "receptionist", "patient"].map((r) => (
              <option key={r} value={r} className="capitalize">{r}</option>
            ))}
          </select>

          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          >
            <option value="">All Actions</option>
            {["create", "update", "delete", "login", "logout"].map((a) => (
              <option key={a} value={a} className="capitalize">{a}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by model..."
            value={filter.model}
            onChange={(e) => setFilter({ ...filter, model: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 w-44"
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["User", "Role", "Action", "Model", "Object ID", "IP Address", "Time"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-gray-400 text-sm">No activity logs found.</p>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {log.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-medium text-gray-800">{log.username || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[log.role] || "bg-gray-100 text-gray-600"}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${actionColors[log.action] || "bg-gray-100 text-gray-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.model_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.object_id || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{log.ip_address || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {log.created_at?.slice(0, 16).replace("T", " ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info note */}
        <p className="text-xs text-gray-400">
          Showing last 200 logs. Use filters to narrow down results.
        </p>
      </div>
    </Layout>
  );
}
