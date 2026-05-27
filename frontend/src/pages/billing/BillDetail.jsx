import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const STATUS_COLOR = {
  Paid:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Partial: "bg-amber-100 text-amber-700 border border-amber-200",
  Overdue: "bg-rose-100 text-rose-700 border border-rose-200",
  Unpaid:  "bg-gray-100 text-gray-600 border border-gray-200",
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

export default function BillDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [bill, setBill]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => { fetchBill(); }, []);

  const fetchBill = async () => {
    try {
      const res = await api.get(`/billing/bills/${id}/`);
      setBill(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load bill details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const canPay = bill && bill.status !== "Paid";

  return (
    <Layout>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Bill Details</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {loading ? "Loading…" : `Bill #${bill?.id}`}
            </h2>
          </div>

          {/* FIX: Only show Record Payment when bill is not fully paid */}
          {!loading && canPay && (
            <button
              onClick={() => navigate(`/receptionist/payments/create/${bill?.id}`)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              + Record Payment
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-14 text-center text-gray-400 shadow-sm animate-pulse">
            Loading bill…
          </div>
        ) : !bill ? (
          <div className="bg-white rounded-2xl p-14 text-center text-rose-400 shadow-sm">
            Failed to load bill. <button onClick={fetchBill} className="underline ml-1">Retry</button>
          </div>
        ) : (
          <>
            {/* ── Summary ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Patient</p>
                  <p className="text-lg font-semibold text-gray-800">{bill.patient_name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLOR[bill.status] || STATUS_COLOR.Unpaid}`}>
                    {bill.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Bill Date</p>
                  <p className="font-medium text-gray-700">{bill.bill_date}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                  <p className="font-medium text-gray-700">{bill.due_date || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">₹ {Number(bill.amount).toLocaleString("en-IN")}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Balance Due</p>
                  <p className={`text-2xl font-bold ${Number(bill.balance_due) > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    ₹ {Number(bill.balance_due).toLocaleString("en-IN")}
                  </p>
                </div>

              </div>
            </div>

            {/* ── Description ── */}
            {bill.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Description</p>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{bill.description}</p>
              </div>
            )}

            {/* ── Payments ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Payments
                </p>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                  {bill.payments?.length || 0} recorded
                </span>
              </div>

              {!bill.payments || bill.payments.length === 0 ? (
                <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-100 rounded-xl">
                  No payments recorded yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Receipt", "Amount", "Method", "Date"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bill.payments.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-mono text-xs text-gray-600">{p.receipt_number}</td>
                          <td className="px-4 py-4 font-bold text-emerald-600">₹ {Number(p.amount_paid).toLocaleString("en-IN")}</td>
                          <td className="px-4 py-4">
                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">{p.payment_method}</span>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-xs">{new Date(p.payment_date).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
