import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistCreateAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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
      const res = await api.post("/receptionist/appointments/create/", form);
      setResult(res.data);
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.appointment_time?.[0] ||
        data?.error ||
        data?.non_field_errors?.[0] ||
        "Failed to create appointment."
      );
    } finally { setLoading(false); }
  };

  if (result) {
    return (
      <Layout>
        <div className="max-w-md space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="font-bold text-green-800 text-lg mb-1">Appointment Created!</h3>
            <p className="text-green-700 text-sm mb-4">Token number assigned successfully.</p>
            <div className="bg-white border border-green-200 rounded-lg p-4 mb-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token Number</p>
              <p className="text-4xl font-bold text-teal-700">{result.token_number}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setResult(null); setForm({ patient: "", doctor: "", appointment_date: "", appointment_time: "", reason: "" }); }}
                className="flex-1 border border-teal-600 text-teal-700 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-50 transition-all"
              >
                New Appointment
              </button>
              <button
                onClick={() => navigate("/receptionist/appointments")}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                View Appointments
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm text-teal-700 hover:underline">← Back</button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create Appointment</h2>
            <p className="text-sm text-gray-500">Fill in the appointment details</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient *</label>
            <select value={form.patient} onChange={set("patient")} required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600">
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name || p.username} — {p.patient_id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor *</label>
            <select value={form.doctor} onChange={set("doctor")} required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600">
              <option value="">Select doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.username} — {d.department_name || d.specialization || "General"}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
              <input type="date" value={form.appointment_date} onChange={set("appointment_date")} required
                min={new Date().toISOString().slice(0, 10)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
              <input type="time" value={form.appointment_time} onChange={set("appointment_time")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
            <textarea value={form.reason} onChange={set("reason")} rows={3}
              placeholder="e.g. Chest pain, routine checkup..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading}
              className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all">
              {loading ? "Creating..." : "Create Appointment"}
            </button>
            <button type="button" onClick={() => navigate(-1)}
              className="px-6 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}