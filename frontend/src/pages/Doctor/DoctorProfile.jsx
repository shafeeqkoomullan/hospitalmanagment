import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

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

  const [error, setError] = useState("");

  // =========================================
  // Load Profile
  // =========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const res = await api.get("/doctorapp/profile/");

      console.log("Profile Response:", res.data);

      // ✅ NEW BACKEND STRUCTURE
      const profileData = res.data?.profile;

      setProfile(profileData);

      setForm(profileData);

      if (profileData?.image) {

        setPreview(
          `http://127.0.0.1:8000${profileData.image}`
        );
      }

    } catch (err) {

      console.log("Profile Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to load profile"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // Image Select
  // =========================================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));
  };

  // =========================================
  // Save Profile
  // =========================================

  const saveProfile = async () => {

    try {

      setSaving(true);

      setError("");

      const fd = new FormData();

      fd.append(
        "specialization",
        form.specialization || ""
      );

      fd.append(
        "qualification",
        form.qualification || ""
      );

      fd.append(
        "years_of_experience",
        form.years_of_experience || 0
      );

      if (imageFile) {
        fd.append("image", imageFile);
      }

      // ✅ UPDATED ENDPOINT
      const res = await api.put(
        "/doctorapp/profile/",
        fd
      );

      const updatedProfile = res.data?.profile;

      setProfile(updatedProfile);

      setForm(updatedProfile);

      setImageFile(null);

      if (updatedProfile?.image) {

        setPreview(
          `http://127.0.0.1:8000${updatedProfile.image}`
        );
      }

      alert("Profile updated successfully");

      setEditing(false);

    } catch (err) {

      console.log("Save Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);
    }
  };

  // =========================================
  // Change Password
  // =========================================

  const changePassword = async () => {

    if (!oldPass || !newPass) {

      alert("Enter both old and new password");

      return;
    }

    try {

      setChangingPass(true);

      // ✅ UPDATED ENDPOINT
      await api.post(
        "/doctorapp/change-password/",
        {
          old_password: oldPass,
          new_password: newPass,
        }
      );

      alert("Password changed successfully. Login again.");

      // ✅ CLEAR ALL TOKENS
      localStorage.removeItem("access");

      localStorage.removeItem("refresh");

      localStorage.removeItem("user");

      window.location.href = "/";

    } catch (err) {

      console.log("Password Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      alert(
        err?.response?.data?.error ||
        err?.response?.data?.old_password ||
        "Password change failed"
      );

    } finally {

      setChangingPass(false);
    }
  };

  // =========================================
  // Loading
  // =========================================

  if (loading) {

    return (

      <Layout>

        <div className="flex items-center justify-center min-h-[60vh]">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6">

            <p className="text-lg text-gray-600">
              Loading profile...
            </p>

          </div>

        </div>

      </Layout>
    );
  }

  // =========================================
  // No Profile
  // =========================================

  if (!profile) {

    return (

      <Layout>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">

          Profile not found

        </div>

      </Layout>
    );
  }

  return (

    <Layout>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

        <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-blue-200 text-sm mb-1">
              Doctor Account
            </p>

            <h1 className="text-3xl font-bold">

              {profile.full_name || profile.username}

            </h1>

            <p className="text-blue-200 mt-2 text-sm">

              {profile.department || "Department"}

            </p>

          </div>

          {!editing ? (

            <button
              onClick={() => setEditing(true)}
              className="bg-white/20 hover:bg-white/30 border border-white/20 px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >

              Edit Profile

            </button>

          ) : (

            <div className="flex gap-3">

              <button
                onClick={saveProfile}
                disabled={saving}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  saving
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >

                {saving ? "Saving..." : "Save"}

              </button>

              <button
                onClick={() => {

                  setForm(profile);

                  setPreview(
                    profile.image
                      ? `http://127.0.0.1:8000/media/${profile.image}`
                      : null
                  );

                  setImageFile(null);

                  setEditing(false);
                }}
                className="bg-white text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-xl text-sm font-medium transition"
              >

                Cancel

              </button>

            </div>

          )}

        </div>

        {/* ========================================= */}
        {/* Error */}
        {/* ========================================= */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3">

            {error}

          </div>

        )}

        {/* ========================================= */}
        {/* Profile Info */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-800">
              Profile Information
            </h2>

          </div>

          <div className="p-6 space-y-6">

            {/* Image */}

            <div className="flex items-center gap-6">

              {preview ? (

                <img
                  src={preview}
                  alt="Doctor"
                  className="w-28 h-36 object-cover rounded-xl border border-gray-200"
                />

              ) : (

                <div className="w-28 h-36 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">

                  No Photo

                </div>

              )}

              {editing && (

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="text-sm"
                />

              )}

            </div>

            {/* Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block text-sm text-gray-500 mb-1">
                  Username
                </label>

                <div className="font-semibold text-gray-800">
                  {profile.username || "-"}
                </div>

              </div>

              <div>

                <label className="block text-sm text-gray-500 mb-1">
                  Email
                </label>

                <div className="font-semibold text-gray-800">
                  {profile.email || "-"}
                </div>

              </div>

              <div>

                <label className="block text-sm text-gray-500 mb-1">
                  Department
                </label>

                <div className="font-semibold text-gray-800">
                  {profile.department || "-"}
                </div>

              </div>

              <div>

                <label className="block text-sm text-gray-500 mb-1">
                  License Number
                </label>

                <div className="font-semibold text-gray-800">
                  {profile.license_no || "-"}
                </div>

              </div>

            </div>

            {/* Editable Fields */}

            <div className="space-y-5">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">

                  Specialization

                </label>

                <input
                  disabled={!editing}
                  value={form.specialization || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specialization: e.target.value
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
                  placeholder="Specialization"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">

                  Qualification

                </label>

                <input
                  disabled={!editing}
                  value={form.qualification || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      qualification: e.target.value
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
                  placeholder="Qualification"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">

                  Years of Experience

                </label>

                <input
                  type="number"
                  disabled={!editing}
                  value={form.years_of_experience || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      years_of_experience: e.target.value
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50"
                  placeholder="Experience"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* Change Password */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-800">
              Change Password
            </h2>

          </div>

          <div className="p-6 space-y-5">

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Old Password

              </label>

              <input
                type="password"
                autoComplete="current-password"
                value={oldPass}
                onChange={(e) =>
                  setOldPass(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter old password"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                New Password

              </label>

              <input
                type="password"
                autoComplete="new-password"
                value={newPass}
                onChange={(e) =>
                  setNewPass(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter new password"
              />

            </div>

            <div className="flex justify-end">

              <button
                onClick={changePassword}
                disabled={changingPass}
                className={`px-5 py-2.5 rounded-xl font-medium text-white transition ${
                  changingPass
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >

                {changingPass
                  ? "Updating..."
                  : "Update Password"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}