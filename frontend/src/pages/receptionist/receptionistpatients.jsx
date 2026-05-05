import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = () => {
    setLoading(true);
    api.get("/receptionist/patients/")
      .then((res) => setPatients(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const toggleBlock = async (id) => {
    try {
      await api.patch(`/receptionist/patients/${id}/toggle-block/`);
      fetchPatients();
    } catch {}
  };

  const filtered = patients.filter((p) =>
    (p.full_name || p.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.patient_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || "").includes(search)
  );

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Patients</h2>
            <p className="text-sm text-gray-500 mt-0.5">{patients.length} total patients</p>
          </div>
          <button
            onClick={() => navigate("/receptionist/patients/register")}
            className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            + Register Patient
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, patient ID or phone..."
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
                {["Patient ID", "Name", "Phone", "Gender", "Age", "Blood Group", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading patients...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">No patients found.</td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-teal-700 font-semibold">{p.patient_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.full_name || p.username}</td>
                  <td className="px-4 py-3 text-gray-600">{p.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.gender || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.age ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.blood_group || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.is_blocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {p.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/receptionist/patients/${p.id}`)}
                        className="text-xs text-teal-700 border border-teal-200 px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleBlock(p.id)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-colors font-medium ${
                          p.is_blocked
                            ? "text-green-700 border-green-200 hover:bg-green-50"
                            : "text-red-600 border-red-200 hover:bg-red-50"
                        }`}
                      >
                        {p.is_blocked ? "Unblock" : "Block"}
                      </button>
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
