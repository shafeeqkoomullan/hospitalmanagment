import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/receptionist/patients/${id}/`),
      api.get(`/receptionist/patients/${id}/medical-records/`),
    ])
      .then(([p, r]) => {
        setPatient(p.data);
        setForm(p.data);
        setRecords(r.data);
      })
      .catch(() => setError("Failed to load patient details."))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.patch(`/receptionist/patients/${id}/update/`, {
        phone: form.phone,
        age: form.age,
        blood_group: form.blood_group,
        emergency_contact: form.emergency_contact,
        address: form.address,
      });
      setPatient(res.data);
      setEditing(false);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const field = (key, type = "text") => ({
    type,
    value: form[key] || "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    disabled: !editing,
    className: `w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none ${
      editing
        ? "border-gray-200 bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
        : "border-transparent bg-gray-50 text-gray-700"
    }`,
  });

  if (loading) return <Layout><div className="text-gray-400 text-sm">Loading...</div></Layout>;
  if (error && !patient) return <Layout><div className="text-red-600 text-sm">{error}</div></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl space-y-5">
        {/* Topbar */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-teal-700 hover:underline">← Back</button>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={save}
                  disabled={saving}
                  className="bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => { setForm(patient); setEditing(false); setError(""); }}
                  className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="border border-teal-600 text-teal-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-all"
              >
                Edit Patient
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        {/* Patient card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {(patient.full_name || patient.username || "P")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{patient.full_name || patient.username}</h3>
              <p className="text-sm font-mono text-teal-600">{patient.patient_id}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{patient.gender} {patient.age ? `· ${patient.age} yrs` : ""}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              patient.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {patient.is_blocked ? "Blocked" : "Active"}
            </span>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
              <input {...field("phone", "tel")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Age</label>
              <input {...field("age", "number")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Blood Group</label>
              {editing ? (
                <select
                  value={form.blood_group || ""}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                >
                  <option value="">Unknown</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              ) : (
                <input {...field("blood_group")} />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Emergency Contact</label>
              <input {...field("emergency_contact", "tel")} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Address</label>
              <input {...field("address")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5">{patient.email || "—"}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Registered</label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5">{patient.created_at?.slice(0, 10) || "—"}</p>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Medical Records <span className="text-gray-400 font-normal text-sm">({records.length})</span>
          </h3>
          {records.length === 0 ? (
            <p className="text-sm text-gray-400">No medical records found for this patient.</p>
          ) : (
            <div className="space-y-3">
              {records.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-lg p-4 text-sm hover:border-teal-100 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-teal-700">{r.doctor_name || "Doctor"}</span>
                    <span className="text-xs text-gray-400">{r.created_at?.slice(0, 10)}</span>
                  </div>
                  <p className="text-gray-700"><span className="font-medium">Diagnosis:</span> {r.diagnosis}</p>
                  {r.prescription && (
                    <p className="text-gray-600 mt-1"><span className="font-medium">Prescription:</span> {r.prescription}</p>
                  )}
                  {r.test_results && (
                    <p className="text-gray-500 mt-1"><span className="font-medium">Tests:</span> {r.test_results}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
