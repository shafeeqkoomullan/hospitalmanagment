import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function DoctorPrescriptionEdit() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // Fetch Prescription
  // =========================================

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {

    try {

      setLoading(true);

      setError("");

      // ✅ Updated endpoint
      const res = await api.get(
        `/doctorapp/prescriptions/${id}/`
      );

      console.log("Prescription Response:", res.data);

      setForm({
        diagnosis: res.data?.diagnosis || "",
        medicines: res.data?.medicines || "",
        notes: res.data?.notes || "",
      });

    } catch (err) {

      console.log("Prescription Fetch Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to load prescription"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // Save Prescription
  // =========================================

  const save = async () => {

    try {

      setSaving(true);

      setError("");

      // ✅ Updated endpoint
      await api.patch(
        `/doctorapp/prescriptions/${id}/`,
        form
      );

      alert("Prescription updated successfully");

      navigate(-1);

    } catch (err) {

      console.log("Prescription Update Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to update prescription"
      );

    } finally {

      setSaving(false);
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
              Loading prescription...
            </p>

          </div>

        </div>

      </Layout>
    );
  }

  return (

    <Layout>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-green-100 text-sm mb-1">
              Prescription Management
            </p>

            <h1 className="text-3xl font-bold">
              Edit Prescription
            </h1>

            <p className="text-green-100 mt-2 text-sm">
              Prescription ID: {id}
            </p>

          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
          >

            Go Back

          </button>

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
        {/* Form */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-800">
              Prescription Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update diagnosis, medicines, and notes
            </p>

          </div>

          {/* Body */}

          <div className="p-6 space-y-6">

            {/* Diagnosis */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Diagnosis

              </label>

              <textarea
                value={form.diagnosis}
                onChange={(e) =>
                  setForm({
                    ...form,
                    diagnosis: e.target.value
                  })
                }
                rows={4}
                placeholder="Enter diagnosis..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />

            </div>

            {/* Medicines */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Medicines

              </label>

              <textarea
                value={form.medicines}
                onChange={(e) =>
                  setForm({
                    ...form,
                    medicines: e.target.value
                  })
                }
                rows={5}
                placeholder="Enter medicines..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />

            </div>

            {/* Notes */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Additional Notes

              </label>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value
                  })
                }
                rows={4}
                placeholder="Enter additional notes..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">

            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition"
            >

              Cancel

            </button>

            <button
              onClick={save}
              disabled={saving}
              className={`px-5 py-2.5 rounded-xl font-medium text-white transition ${
                saving
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >

              {saving
                ? "Updating..."
                : "Update Prescription"}

            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}