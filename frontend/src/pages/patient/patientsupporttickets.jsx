import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTickets = () => {
    setFetching(true);
    api.get("/patients/tickets/")
      .then((res) => setTickets(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await api.post("/patients/tickets/", form);
      setSuccess(true);
      setForm({ subject: "", message: "" });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      setError(
        err?.response?.data?.subject?.[0] ||
        err?.response?.data?.message?.[0] ||
        "Failed to submit ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    open: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };

  const statusIcons = {
    open: "🟡",
    in_progress: "🔵",
    resolved: "🟢",
  };

  return (
    <Layout>
      <div className="space-y-5 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Support Tickets</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Raise issues or questions to our support team
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(false); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showForm
                ? "border border-gray-300 text-gray-600 hover:bg-gray-50"
                : "bg-teal-700 hover:bg-teal-800 text-white"
            }`}
          >
            {showForm ? "Cancel" : "+ New Ticket"}
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            ✅ Your ticket has been submitted. Our team will respond soon.
          </div>
        )}

        {/* New ticket form */}
        {showForm && (
          <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">New Support Ticket</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                ⚠ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
              <input
                type="text"
                value={form.subject}
                onChange={set("subject")}
                required
                placeholder="Brief description of your issue..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={set("message")}
                required
                rows={5}
                placeholder="Describe your issue in detail. Include any relevant dates, appointment numbers, or doctor names..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                className="px-6 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Tickets list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">
              My Tickets
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {tickets.length}
              </span>
            </h3>
            <button
              onClick={fetchTickets}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              ↻ Refresh
            </button>
          </div>

          {fetching ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="text-4xl mb-3">🎫</div>
              <p className="text-gray-500 font-medium text-sm">No tickets yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Click "+ New Ticket" to raise a support request.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tickets.map((t) => (
                <div key={t.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{statusIcons[t.status]}</span>
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {t.subject}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {t.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Submitted: {t.created_at?.slice(0, 10) || "—"}
                        {t.updated_at && t.updated_at !== t.created_at && (
                          <span className="ml-2">· Updated: {t.updated_at?.slice(0, 10)}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${statusColors[t.status] || "bg-gray-100 text-gray-600"}`}>
                        {t.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          💡 Our support team typically responds within 24 hours. For emergencies, call{" "}
          <a href="tel:04953069000" className="font-semibold underline">0495 3069000</a>.
        </div>

      </div>
    </Layout>
  );
}
