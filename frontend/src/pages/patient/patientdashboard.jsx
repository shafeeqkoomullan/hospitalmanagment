import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistVisitorLog() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patient: "", visitor_name: "", relation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    api.get("/receptionist/patients/")
      .then((r) => setPatients(r.data))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/receptionist/visitor/", form);
      setVisitors((prev) => [res.data, ...prev]);
      setForm({ patient: "", visitor_name: "", relation: "" });
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to log visitor.");
    } finally {
      setLoading(false);
    }   
  };

  const checkout = async (id) => {
    try {
      await api.post(`/receptionist/visitor/checkout/${id}/`);
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, check_out_time: new Date().toISOString(), is_checked_out: true }
            : v
        )
      );
    } catch {}
  };

  const getPatientName = (id) => {
    const p = patients.find((p) => String(p.id) === String(id));
    return p ? (p.full_name || p.username) : "—";
  };

  const formatTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Visitor Log</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track visitors coming to see patients</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">Log New Visitor</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient *</label>
            <select
              value={form.patient}
              onChange={set("patient")}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
            >
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || p.username} — {p.patient_id}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Visitor Name *</label>
              <input
                type="text"
                value={form.visitor_name}
                onChange={set("visitor_name")}
                required
                placeholder="Full name of visitor"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation</label>
              <input
                type="text"
                value={form.relation}
                onChange={set("relation")}
                placeholder="e.g. Spouse, Parent, Friend"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all"
          >
            {loading ? "Logging..." : "Log Visitor Check-In"}
          </button>
        </form>

        {/* Visitor table */}
        {visitors.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700 text-sm">Today's Visitors ({visitors.length})</h3>
              <span className="text-xs text-gray-400">
                {visitors.filter((v) => !v.is_checked_out && !v.check_out_time).length} still inside
              </span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Visitor", "Relation", "Visiting", "In", "Out", "Action"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visitors.map((v) => {
                  const checkedOut = v.is_checked_out || !!v.check_out_time;
                  return (
                    <tr key={v.id} className={`hover:bg-gray-50 transition-colors ${checkedOut ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{v.visitor_name}</td>
                      <td className="px-4 py-3 text-gray-500">{v.relation || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{v.patient_name || getPatientName(v.patient)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(v.check_in_time)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(v.check_out_time)}</td>
                      <td className="px-4 py-3">
                        {checkedOut ? (
                          <span className="text-xs text-gray-400 font-medium">Checked Out</span>
                        ) : (
                          <button
                            onClick={() => checkout(v.id)}
                            className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {visitors.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No visitors logged yet today.
          </div>
        )}
      </div>
    </Layout>
  );
}
