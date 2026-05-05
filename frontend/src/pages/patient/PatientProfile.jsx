import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/patients/me/")
      .then((res) => { setProfile(res.data); setForm(res.data); })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await api.patch("/patients/me/", {
        phone: form.phone,
        age: form.age,
        blood_group: form.blood_group,
        emergency_contact: form.emergency_contact,
        address: form.address,
      });
      setProfile(res.data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.phone?.[0] || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const field = (key, type = "text") => ({
    type,
    value: form[key] || "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    disabled: !editing,
    className: `w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none ${
      editing
        ? "border-gray-200 bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
        : "border-transparent bg-gray-50 text-gray-700"
    }`,
  });

  if (loading) return <Layout><div className="text-gray-400 text-sm">Loading profile...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            <p className="text-sm text-gray-500 mt-0.5">View and update your personal information</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={save}
                  disabled={saving}
                  className="bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => { setForm(profile); setEditing(false); setError(""); }}
                  className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="border border-teal-600 text-teal-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">⚠ {error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">✅ Profile updated successfully.</div>
        )}

        {/* Avatar + ID card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {(profile?.full_name || profile?.username || "P")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{profile?.full_name || profile?.username}</h3>
              <p className="text-sm font-mono text-teal-600 mt-0.5">{profile?.patient_id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Registered</p>
              <p className="font-medium text-gray-600 mt-0.5">{profile?.created_at?.slice(0, 10) || "—"}</p>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
              <input {...field("phone", "tel")} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Age</label>
              <input {...field("age", "number")} min="0" max="120" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5 capitalize">{profile?.gender || "—"}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Blood Group</label>
              {editing ? (
                <select
                  value={form.blood_group || ""}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                >
                  <option value="">Unknown</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5">{profile?.blood_group || "—"}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Emergency Contact</label>
              <input {...field("emergency_contact", "tel")} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5">{profile?.email || "—"}</p>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Address</label>
              {editing ? (
                <textarea
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5 min-h-[44px]">{profile?.address || "—"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Change password link */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 text-sm">Password</p>
            <p className="text-xs text-gray-400 mt-0.5">Keep your account secure</p>
          </div>
          <button
            onClick={() => navigate("/patient/change-password")}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
          >
            Change Password →
          </button>
        </div>

      </div>
    </Layout>
  );
}
