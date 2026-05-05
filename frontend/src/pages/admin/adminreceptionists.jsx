import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminReceptionists() {
  const navigate = useNavigate();
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReceptionists = () => {
    setLoading(true);
    api.get("/accounts/accounts/?role=receptionist")
      .then((res) => setReceptionists(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReceptionists(); }, []);

  const toggleActive = async (pk) => {
    setActionLoading(pk);
    try {
      await api.post(`/admin-panel/toggle-user/${pk}/`);
      fetchReceptionists();
    } catch {} finally { setActionLoading(null); }
  };

  const filtered = receptionists.filter((r) =>
    (r.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Receptionists</h2>
            <p className="text-sm text-gray-500 mt-0.5">{receptionists.length} total receptionists</p>
          </div>
          <button
            onClick={() => navigate("/admin/receptionists/create")}
            className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            + Add Receptionist
          </button>
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Loading receptionists...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No receptionists found.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {r.username?.[0]?.toUpperCase() || "R"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{r.username}</p>
                        {r.first_name && <p className="text-xs text-gray-400">{r.first_name} {r.last_name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.date_joined?.slice(0, 10) || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(r.id)}
                      disabled={actionLoading === r.id}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors disabled:opacity-50 ${
                        r.is_active ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-700 border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {actionLoading === r.id ? "..." : r.is_active ? "Deactivate" : "Activate"}
                    </button>
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
