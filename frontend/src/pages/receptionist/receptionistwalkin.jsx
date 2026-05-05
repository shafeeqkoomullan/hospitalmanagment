import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistWalkIn() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patient: "", doctor: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/receptionist/doctors/"),
      api.get("/receptionist/patients/"),
    ]).then(([d, p]) => {
      setDoctors(d.data);
      setPatients(p.data);
    }).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/receptionist/walkin/", form);
      setResult(res.data);
      setHistory((prev) => [res.data, ...prev]);
      setForm({ patient: "", doctor: "" });
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to register walk-in.");
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (id) => {
    const p = patients.find((p) => String(p.id) === String(id));
    return p ? (p.full_name || p.username) : "—";
  };

  const getDoctorName = (id) => {
    const d = doctors.find((d) => String(d.id) === String(id));
    return d ? d.username : "—";
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Walk-In Registration</h2>
          <p className="text-sm text-gray-500 mt-0.5">Register a patient for immediate consultation</p>
        </div>

        {/* Token result */}
        {result && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex items-center gap-5">
            <div className="text-center">
              <p className="text-xs text-teal-600 uppercase tracking-wider font-semibold mb-1">Token</p>
              <p className="text-5xl font-bold text-teal-700">{result.token_number}</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-teal-800 text-sm">Walk-in registered successfully!</p>
              <p className="text-teal-600 text-xs mt-1">
                Patient: {result.patient_name || "—"}<br />
                Doctor: {result.doctor_name || "—"}
              </p>
            </div>
            <button
              onClick={() => setResult(null)}
              className="text-teal-500 hover:text-teal-700 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor *</label>
            <select
              value={form.doctor}
              onChange={set("doctor")}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
            >
              <option value="">Select doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.username} — {d.specialization || "General"}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-all"
          >
            {loading ? "Registering..." : "Register & Generate Token"}
          </button>
        </form>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 text-sm">Today's Walk-Ins</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Token", "Patient", "Doctor", "Time"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((w, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold font-mono text-teal-700">{w.token_number}</td>
                    <td className="px-4 py-3 text-gray-800">{w.patient_name || getPatientName(w.patient)}</td>
                    <td className="px-4 py-3 text-gray-600">{w.doctor_name || getDoctorName(w.doctor)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
