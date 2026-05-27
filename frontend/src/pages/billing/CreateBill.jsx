import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

function Toast({ message, type, onClose }) {
  if (!message) return null;
  const colors = type === "error"
    ? "bg-rose-50 border-rose-200 text-rose-700"
    : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors}`}>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

export default function CreateBill() {
  const { appointmentId } = useParams();
  const navigate          = useNavigate();

  const [appointment, setAppointment]     = useState(null);
  const [consultationFee, setConsultationFee] = useState("");
  const [medicineFee, setMedicineFee]     = useState("");
  const [testFee, setTestFee]             = useState("");
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => { fetchAppointment(); }, []);

  const fetchAppointment = async () => {
    try {
      const res = await api.get(`/appointments/${appointmentId}/`);
      setAppointment(res.data);
      setConsultationFee(res.data.doctor_fee || "");
    } catch (err) {
      console.error(err);
      showToast("Failed to load appointment details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const total =
    Number(consultationFee || 0) +
    Number(medicineFee || 0) +
    Number(testFee || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (total <= 0) {
      showToast("Total amount must be greater than zero.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const description = [
        `Consultation: ₹${Number(consultationFee || 0)}`,
        `Medicine: ₹${Number(medicineFee || 0)}`,
        `Tests: ₹${Number(testFee || 0)}`,
      ].join("\n");

      await api.post("/billing/bills/", {
        // FIX: Was sending appointment.patient_id (the "PAT-XXXX" string).
        // The API expects the numeric PK — use appointment.patient instead.
        patient:     appointment.patient,
        appointment: appointmentId,
        amount:      total,
        description,
      });

      showToast("Bill created successfully!");
      setTimeout(() => navigate("/receptionist/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Failed to create bill.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const feeFields = [
    { label: "Consultation Fee", value: consultationFee, onChange: setConsultationFee },
    { label: "Medicine Fee",     value: medicineFee,     onChange: setMedicineFee },
    { label: "Test Fee",         value: testFee,         onChange: setTestFee },
  ];

  return (
    <Layout>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <button onClick={() => navigate(-1)} className="text-xs text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Create Bill</h2>
          <p className="text-gray-400 text-sm mt-1">Generate patient invoice for appointment #{appointmentId}</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-14 text-center text-gray-300 animate-pulse">Loading appointment…</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5">

            {/* Patient & Doctor (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Patient</label>
                <input
                  type="text"
                  value={appointment?.patient_name || ""}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Doctor</label>
                <input
                  type="text"
                  value={appointment?.doctor_name ? `Dr. ${appointment.doctor_name}` : ""}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-600 text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Fee inputs */}
            {feeFields.map(field => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-teal-50 rounded-xl p-5 flex items-center justify-between border border-teal-100">
              <span className="text-gray-600 font-semibold text-sm">Total Amount</span>
              <span className="text-2xl font-bold text-teal-700">₹ {total.toLocaleString("en-IN")}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || total <= 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create Bill"}
              </button>
            </div>

          </form>
        )}
      </div>
    </Layout>
  );
}
