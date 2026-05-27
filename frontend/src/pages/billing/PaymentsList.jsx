import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function PaymentsList() {
  const navigate          = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [search, setSearch]     = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/billing/payments/");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return (
      p?.patient_name?.toLowerCase().includes(q) ||
      p?.receipt_number?.toLowerCase().includes(q) ||
      String(p?.bill).includes(q)
    );
  });

  // Stats from full list
  const totalRevenue  = payments.reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const methodCounts  = payments.reduce((acc, p) => {
    acc[p.payment_method] = (acc[p.payment_method] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Payments", value: payments.length,                                          color: "text-gray-800" },
    { label: "Total Revenue",  value: `₹ ${totalRevenue.toLocaleString("en-IN")}`,             color: "text-emerald-600" },
    { label: "Cash",           value: methodCounts["Cash"] || 0,                                color: "text-blue-600" },
    { label: "UPI",            value: methodCounts["UPI"] || 0,                                 color: "text-purple-600" },
  ];

  const METHOD_COLOR = {
    Cash:      "bg-blue-50 text-blue-700",
    Card:      "bg-indigo-50 text-indigo-700",
    UPI:       "bg-purple-50 text-purple-700",
    Insurance: "bg-amber-50 text-amber-700",
    Other:     "bg-gray-100 text-gray-600",
  };

  return (
    <Layout>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-7 text-white shadow-md">
          <p className="text-teal-200 text-xs uppercase tracking-widest mb-1">Financial Records</p>
          <h2 className="text-3xl font-bold">Payments</h2>
          <p className="text-teal-200 text-sm mt-1">Track and manage payment records</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <span className="text-gray-300 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by patient, receipt or bill ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none placeholder-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Receipt", "Bill", "Patient", "Amount", "Method", "Date", ""].map((h, i) => (
                    <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-14 text-gray-300 animate-pulse text-sm">Loading payments…</td></tr>
                ) : error ? (
                  <tr><td colSpan="7" className="text-center py-14 text-rose-400 text-sm">
                    Failed to load. <button onClick={fetchPayments} className="underline ml-1">Retry</button>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-14 text-gray-300 text-sm">
                    {search ? "No results matching your search" : "No payments recorded yet"}
                  </td></tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs text-gray-500">{p.receipt_number}</td>
                      <td className="px-6 py-5 text-gray-500 text-xs">#{p.bill}</td>
                      <td className="px-6 py-5 font-medium text-gray-800">{p.patient_name || "Unknown"}</td>
                      <td className="px-6 py-5 font-bold text-emerald-600">₹ {Number(p.amount_paid).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${METHOD_COLOR[p.payment_method] || METHOD_COLOR.Other}`}>
                          {p.payment_method || "Cash"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-xs">{new Date(p.payment_date).toLocaleDateString("en-IN")}</td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => navigate(`/receptionist/bills/${p.bill}`)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                        >
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results count when searching */}
          {search && !loading && (
            <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
              {filtered.length} of {payments.length} payments
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
