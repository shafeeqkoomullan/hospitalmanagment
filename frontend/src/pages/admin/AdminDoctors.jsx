import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDoctors = () => {
    setLoading(true);
    api.get("/admin-panel/doctors/")
      .then((res) => setDoctors(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const toggleActive = async (userId, isActive) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin-panel/toggle-user/${userId}/`);
      fetchDoctors();
    } catch {}
    finally { setActionLoading(null); }
  };

  const filtered = doctors.filter((d) =>
    (d.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Doctors</h2>
            <p className="text-sm text-gray-500 mt-0.5">{doctors.length} total doctors</p>
          </div>
          <button
            onClick={() => navigate("/admin/doctors/create")}
            className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            + Add Doctor
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, specialization or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Doctor", "Email", "Specialization", "Department", "Experience", "License", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading doctors...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">No doctors found.</td>
                </tr>
              ) : filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {d.username?.[0]?.toUpperCase() || "D"}
                      </div>
                      <span className="font-medium text-gray-800">{d.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.email}</td>
                  <td className="px-4 py-3 text-gray-600">{d.specialization || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{d.department || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{d.years_of_experience ? `${d.years_of_experience} yrs` : "—"}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{d.license_no || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {d.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(d.user_id, d.is_active)}
                      disabled={actionLoading === d.user_id}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium disabled:opacity-50 ${
                        d.is_active
                          ? "text-red-600 border-red-200 hover:bg-red-50"
                          : "text-green-700 border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {actionLoading === d.user_id ? "..." : d.is_active ? "Deactivate" : "Activate"}
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
