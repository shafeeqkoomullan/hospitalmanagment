import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchDepartments = () => {
    setLoading(true);
    api.get("/admin-panel/departments/")
      .then((res) => setDepartments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepartments(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/admin-panel/departments/", form);
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      setError(err?.response?.data?.name?.[0] || "Failed to create department.");
    } finally { setSaving(false); }
  };

  const deleteDept = async (id) => {
    if (!window.confirm("Delete this department? This may affect doctors assigned to it.")) return;
    setDeleteLoading(id);
    try {
      await api.delete(`/admin-panel/departments/${id}/`);
      fetchDepartments();
    } catch {
      alert("Failed to delete department.");
    } finally { setDeleteLoading(null); }
  };

  return (
    <Layout>
      <div className="space-y-5 max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Departments</h2>
            <p className="text-sm text-gray-500 mt-0.5">{departments.length} departments</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showForm
                ? "border border-gray-300 text-gray-600 hover:bg-gray-50"
                : "bg-teal-700 hover:bg-teal-800 text-white"
            }`}
          >
            {showForm ? "Cancel" : "+ Add Department"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">New Department</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Cardiology"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Brief description of this department..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                {saving ? "Saving..." : "Save Department"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm({ name: "", description: "" }); setError(""); }}
                className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Departments list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading departments...</div>
          ) : departments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🏥</div>
              <p className="text-gray-500 font-medium text-sm">No departments yet</p>
              <p className="text-gray-400 text-xs mt-1">Add your first department using the button above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {departments.map((d, i) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{d.name}</p>
                      {d.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDept(d.id)}
                    disabled={deleteLoading === d.id}
                    className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    {deleteLoading === d.id ? "..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
