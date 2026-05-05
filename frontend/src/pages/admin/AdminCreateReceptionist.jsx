import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminCreateReceptionist() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    shift: "Morning",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/admin-panel/create-receptionist/", form);
      navigate("/admin/receptionists");
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.error ||
        data?.message ||
        data?.username?.[0] ||
        data?.email?.[0] ||
        "Failed to create receptionist."
      );
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="max-w-md space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm text-teal-700 hover:underline">← Back</button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create Receptionist</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add a new receptionist account</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username *</label>
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              required
              placeholder="e.g. receptionist_01"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              required
              placeholder="receptionist@hospital.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              required
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Shift</label>
            <div className="grid grid-cols-3 gap-3">
              {["Morning", "Evening", "Night"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, shift: s })}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    form.shift === s
                      ? "bg-teal-700 text-white border-teal-700"
                      : "border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700"
                  }`}
                >
                  {s === "Morning" ? "🌅" : s === "Evening" ? "🌆" : "🌙"} {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all"
            >
              {loading ? "Creating..." : "Create Receptionist"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
