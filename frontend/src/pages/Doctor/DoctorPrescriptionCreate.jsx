import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function DoctorPrescriptionCreate() {

  const { patientId } = useParams();

  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState("");

  const [medicines, setMedicines] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // Submit Prescription
  // =========================================

  const submit = async () => {

    try {

      setLoading(true);

      setError("");

      // ✅ Updated endpoint
      await api.post(
        "/doctorapp/prescriptions/",
        {
          patient: patientId,
          diagnosis,
          medicines,
          notes,
        }
      );

      alert("Prescription created successfully");

      navigate(-1);

    } catch (err) {

      console.log("Prescription Create Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to create prescription"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <Layout>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

        <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-blue-200 text-sm mb-1">
              Prescription Management
            </p>

            <h1 className="text-3xl font-bold">
              Create Prescription
            </h1>

            <p className="text-blue-200 mt-2 text-sm">
              Patient ID: {patientId}
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
              Fill in diagnosis, medicines, and notes
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
                value={diagnosis}
                onChange={(e) =>
                  setDiagnosis(e.target.value)
                }
                placeholder="Enter diagnosis..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />

            </div>

            {/* Medicines */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Medicines

              </label>

              <textarea
                value={medicines}
                onChange={(e) =>
                  setMedicines(e.target.value)
                }
                placeholder="Enter medicines..."
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />

            </div>

            {/* Notes */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Additional Notes

              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Enter additional notes..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
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
              onClick={submit}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-medium text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >

              {loading
                ? "Saving..."
                : "Save Prescription"}

            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}