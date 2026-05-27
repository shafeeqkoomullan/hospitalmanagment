import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const STATUS_COLOR = {
  Paid:    "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Unpaid:  "bg-rose-100 text-rose-700",
  Overdue: "bg-orange-100 text-orange-700",
};

export default function BillingDashboard() {
  const navigate    = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/billing/dashboard/");
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
          Loading billing dashboard…
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-rose-500 text-sm">Failed to load dashboard.</p>
          <button onClick={fetchDashboard} className="text-teal-600 underline text-sm">Retry</button>
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: "Daily Earnings",   value: `₹ ${Number(data.daily_earnings).toLocaleString("en-IN")}`,   bg: "bg-emerald-600", icon: "💰" },
    { label: "Monthly Earnings", value: `₹ ${Number(data.monthly_earnings).toLocaleString("en-IN")}`, bg: "bg-teal-600",    icon: "📈" },
    { label: "Total Bills",      value: data.bills?.total ?? 0,                                        bg: "bg-blue-600",    icon: "🧾" },
    { label: "Pending Amount",   value: `₹ ${Number(data.unpaid_amount).toLocaleString("en-IN")}`,     bg: "bg-rose-500",    icon: "⚠️" },
  ];

  const actions = [
    { label: "View Bills",      path: "/receptionist/bills",        icon: "🧾", color: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100" },
    { label: "View Payments",   path: "/receptionist/payments",     icon: "💰", color: "border-green-200 bg-green-50 text-green-800 hover:bg-green-100" },
    { label: "Appointments",    path: "/receptionist/appointments", icon: "📅", color: "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100" },
    { label: "Patients",        path: "/receptionist/patients",     icon: "🧑‍⚕️", color: "border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100" },
  ];

  const statusSummary = [
    { key: "paid",    label: "Paid",    color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "partial", label: "Partial", color: "text-amber-600",   bg: "bg-amber-50" },
    { key: "unpaid",  label: "Unpaid",  color: "text-rose-600",    bg: "bg-rose-50" },
    { key: "overdue", label: "Overdue", color: "text-orange-600",  bg: "bg-orange-50" },
  ];

  return (
    <Layout>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-7 text-white shadow-md">
          <p className="text-teal-200 text-xs uppercase tracking-widest mb-1">Financial Overview</p>
          <h2 className="text-3xl font-bold">Billing Dashboard</h2>
          <p className="text-teal-200 text-sm mt-1">Monitor bills, payments and revenue</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} text-white rounded-2xl p-5 shadow-md`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map(a => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`${a.color} border rounded-xl px-4 py-3 text-sm font-medium transition-all text-left flex items-center gap-2`}
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bill Status Summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Bill Status Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusSummary.map(s => (
              <div key={s.key} className={`${s.bg} p-5 rounded-2xl`}>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{data.bills?.[s.key] ?? 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Bills ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recent Bills</p>
            <button
              onClick={() => navigate("/receptionist/bills")}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              View All →
            </button>
          </div>

          {data.recent_bills?.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No bills yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Patient", "Amount", "Status", "Date"].map(h => (
                      <th key={h} className="py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recent_bills.map(bill => (
                    <tr
                      key={bill.id}
                      onClick={() => navigate(`/receptionist/bills/${bill.id}`)}
                      className="border-b last:border-none hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 font-medium text-gray-800">{bill.patient_name || "—"}</td>
                      <td className="py-4 font-bold text-gray-700">₹ {Number(bill.amount).toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLOR[bill.status] || "bg-gray-100 text-gray-500"}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 text-xs">{bill.bill_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
