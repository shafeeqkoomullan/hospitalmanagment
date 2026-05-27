import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";

const STATUS_COLOR = {
  Paid:    "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Unpaid:  "bg-rose-100 text-rose-700",
  Overdue: "bg-orange-100 text-orange-700",
};

export default function BillsList() {
  const navigate        = useNavigate();
  const [bills, setBills]             = useState([]);
  const [allBills, setAllBills]       = useState([]); // FIX: Keep unfiltered copy for stats
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError]             = useState(false);

  const fetchBills = async (filter = "") => {
    setLoading(true);
    setError(false);
    try {
      const url = filter ? `/billing/bills/?status=${filter}` : "/billing/bills/";
      const res = await api.get(url);
      setBills(res.data);
      // FIX: Fetch unfiltered list once for accurate stats regardless of active filter
      if (!filter) setAllBills(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // On mount fetch unfiltered to populate stats
  useEffect(() => { fetchBills(); }, []);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    fetchBills(val);
  };

  // FIX: Stats always derived from full unfiltered list
  const totalBills   = allBills.length;
  const paidBills    = allBills.filter(b => b.status === "Paid").length;
  const unpaidBills  = allBills.filter(b => b.status === "Unpaid").length;
  const totalRevenue = allBills.reduce((s, b) => s + Number(b.amount || 0), 0);

  const statCards = [
    { label: "Total Bills",    value: totalBills,                                                color: "text-gray-800" },
    { label: "Paid",           value: paidBills,                                                 color: "text-emerald-600" },
    { label: "Unpaid",         value: unpaidBills,                                               color: "text-rose-600" },
    { label: "Total Revenue",  value: `₹ ${totalRevenue.toLocaleString("en-IN")}`,              color: "text-teal-700" },
  ];

  return (
    <Layout>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-7 text-white shadow-md">
          <p className="text-teal-200 text-xs uppercase tracking-widest mb-1">Billing Management</p>
          <h2 className="text-3xl font-bold">Bills</h2>
          <p className="text-teal-200 text-sm mt-1">Manage patient billing records</p>
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

        {/* ── Filter ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Filter:</span>
          {["", "Paid", "Partial", "Unpaid", "Overdue"].map(s => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === s
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Bill ID", "Patient", "Amount", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-14 text-gray-300 text-sm animate-pulse">Loading bills…</td></tr>
                ) : error ? (
                  <tr><td colSpan="6" className="text-center py-14 text-rose-400 text-sm">
                    Failed to load bills. <button onClick={() => fetchBills(statusFilter)} className="underline ml-1">Retry</button>
                  </td></tr>
                ) : bills.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-14 text-gray-300 text-sm">No bills found</td></tr>
                ) : (
                  bills.map(bill => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-gray-500 text-xs">#{bill.id}</td>
                      <td className="px-6 py-5 font-medium text-gray-800">{bill.patient_name || "Unknown"}</td>
                      <td className="px-6 py-5 font-bold text-gray-800">₹ {Number(bill.amount).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLOR[bill.status] || "bg-gray-100 text-gray-500"}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-xs">{bill.bill_date}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/receptionist/bills/${bill.id}`)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                          >
                            View
                          </button>
                          {bill.status !== "Paid" && (
                            <button
                              onClick={() => navigate(`/receptionist/payments/create/${bill.id}`)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                            >
                              Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
