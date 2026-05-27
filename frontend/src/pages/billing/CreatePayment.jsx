import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const STATUS_COLOR = {
  Paid:    "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Unpaid:  "bg-rose-100 text-rose-700",
  Overdue: "bg-orange-100 text-orange-700",
};

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

export default function CreatePayment() {
  const { billId } = useParams();
  const navigate   = useNavigate();

  const [bill, setBill]               = useState(null);
  const [amountPaid, setAmountPaid]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [toast, setToast]             = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => { fetchBill(); }, []);

  const fetchBill = async () => {
    try {
      const res = await api.get(`/billing/bills/${billId}/`);
      // FIX: Removed console.log(res.data) left in production code
      setBill(res.data);
      setAmountPaid(res.data?.balance_due || "");
    } catch (err) {
      console.error(err);
      showToast("Failed to load bill details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(amountPaid) <= 0) {
      showToast("Amount must be greater than zero.", "error");
      return;
    }

    if (bill && Number(amountPaid) > Number(bill.balance_due)) {
      showToast("Amount exceeds balance due.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/billing/payments/", {
        bill:           billId,
        amount_paid:    amountPaid,
        payment_method: paymentMethod,
        notes,
      });
      showToast("Payment recorded successfully!");
      setTimeout(() => navigate(`/receptionist/bills/${billId}`), 1200);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.amount_paid?.[0]
        || err?.response?.data?.detail
        || "Failed to record payment.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-gray-300 animate-pulse text-sm">
          Loading payment page…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-7 text-white shadow-md">
          <p className="text-teal-200 text-xs uppercase tracking-widest mb-1">Billing Payment</p>
          <h2 className="text-3xl font-bold">Record Payment</h2>
          <p className="text-teal-200 text-sm mt-1">Bill #{bill?.id} — {bill?.patient_name}</p>
        </div>

        {/* ── Bill Summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Bill Summary</p>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLOR[bill?.status] || "bg-gray-100 text-gray-500"}`}>
                {bill?.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-gray-800">₹ {Number(bill?.amount).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Already Paid</p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹ {Number(Number(bill?.amount) - Number(bill?.balance_due)).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Balance Due</p>
              <p className="text-xl font-bold text-rose-600">₹ {Number(bill?.balance_due).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount Paid</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
              <input
                type="number"
                min="1"
                max={bill?.balance_due}
                value={amountPaid}
                onChange={e => setAmountPaid(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            {bill?.balance_due && (
              <p className="text-xs text-gray-400 mt-1">
                Max: ₹ {Number(bill.balance_due).toLocaleString("en-IN")}
                <button type="button" onClick={() => setAmountPaid(bill.balance_due)} className="ml-2 text-teal-600 hover:underline">
                  Pay full
                </button>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {["Cash", "Card", "UPI", "Insurance", "Other"].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    paymentMethod === m
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional notes…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {submitting ? "Recording…" : "Record Payment"}
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
