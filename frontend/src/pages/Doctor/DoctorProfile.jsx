import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // =====================
  // Load profile
  // =====================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/profile/");
      setProfile(res.data);
      setForm(res.data);

      if (res.data.image) {
        setPreview(`http://127.0.0.1:8000${res.data.image}`);
      }
    } catch (err) {
      console.log(err?.response?.data || err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Handle image select
  // =====================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================
  // Save profile + image
  // =====================
  const saveProfile = async () => {
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("specialization", form.specialization || "");
      fd.append("qualification", form.qualification || "");
      fd.append("years_of_experience", form.years_of_experience || 0);

      if (imageFile) fd.append("image", imageFile);

      const res = await api.put("/doctor/profile/", fd);

      setProfile(res.data);
      setForm(res.data);
      setImageFile(null);

      if (res.data.image) {
        setPreview(`http://127.0.0.1:8000${res.data.image}`);
      }

      alert("Profile updated");
      // STAY in edit mode
    } catch (err) {
      console.log(err?.response?.data || err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =====================
  // Change password
  // =====================
  const changePassword = async () => {
    if (!oldPass || !newPass) {
      alert("Enter both old and new password");
      return;
    }

    try {
      setChangingPass(true);

      await api.post("/doctor/change-password/", {
        old_password: oldPass,
        new_password: newPass,
      });

      alert("Password changed. Login again.");

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      alert(err?.response?.data?.message || "Password change failed");
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Doctor Profile</h2>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="border px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => {
                setForm(profile);
                setPreview(profile.image ? `http://127.0.0.1:8000${profile.image}` : null);
                setImageFile(null);
                setEditing(false);
              }}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <div className="flex items-center space-x-4">
          {preview ? (
            <img
              src={preview}
              style={{ width: "90px", height: "120px" }}
              className="object-cover border rounded"
            />
          ) : (
            <div
              style={{ width: "90px", height: "120px" }}
              className="border rounded flex items-center justify-center text-gray-400 text-xs"
            >
              No Photo
            </div>
          )}

          {editing && (
            <input type="file" accept="image/*" onChange={handleImage} />
          )}
        </div>

        <div><b>Username:</b> {profile.user.username}</div>
        <div><b>Email:</b> {profile.user.email}</div>
        <div><b>Department:</b> {profile.department || "-"}</div>

        <input
          disabled={!editing}
          value={form.specialization || ""}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className="border p-2 w-full rounded"
          placeholder="Specialization"
        />

        <input
          disabled={!editing}
          value={form.qualification || ""}
          onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          className="border p-2 w-full rounded"
          placeholder="Qualification"
        />

        <input
          type="number"
          disabled={!editing}
          value={form.years_of_experience || 0}
          onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })}
          className="border p-2 w-full rounded"
          placeholder="Experience"
        />
      </div>

      {/* Password */}
      <div className="bg-white p-6 shadow rounded space-y-3">
        <h3 className="font-semibold">Change Password</h3>

        <input
          placeholder="Old password"
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="New password"
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={changePassword}
          disabled={changingPass}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {changingPass ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
