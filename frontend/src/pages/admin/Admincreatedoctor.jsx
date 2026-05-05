import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminCreateDoctor() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    specialization: "",
    license_no: "",
    qualification: "",
    years_of_experience: 0,
    department_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin-panel/departments/")
      .then((res) => setDepartments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/admin-panel/create-doctor/", form);
      navigate("/admin/doctors");
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.error ||
        data?.message ||
        data?.username?.[0] ||
        data?.license_no?.[0] ||
        "Failed to create doctor."
      );
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm text-teal-700 hover:underline">← Back</button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create Doctor</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add a new doctor to the system</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}

        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">

          {/* Account details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set("username")}
                  required
                  placeholder="e.g. dr_john"
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
                  placeholder="doctor@hospital.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
              <div className="col-span-2">
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
            </div>
          </div>

          {/* Professional details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">License No. *</label>
                <input
                  type="text"
                  value={form.license_no}
                  onChange={set("license_no")}
                  required
                  placeholder="e.g. MCI-12345"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={set("specialization")}
                  placeholder="e.g. Cardiologist"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualification</label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={set("qualification")}
                  placeholder="e.g. MBBS, MD"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  value={form.years_of_experience}
                  onChange={set("years_of_experience")}
                  min="0"
                  max="60"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <select
                  value={form.department_id}
                  onChange={set("department_id")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                >
                  <option value="">No department assigned</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all"
            >
              {loading ? "Creating..." : "Create Doctor"}
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
