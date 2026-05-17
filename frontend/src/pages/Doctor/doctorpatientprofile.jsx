import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function DoctorPatientProfile() {

  // ✅ FIXED
  const { pk } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // Fetch Patient
  // =========================================

  useEffect(() => {
    fetchPatient();
  }, [pk]);

  const fetchPatient = async () => {

    try {

      setLoading(true);

      setError("");

      // ✅ FIXED ENDPOINT
      const res = await api.get(
        `/doctorapp/patients/${pk}/`
      );

      console.log("Patient Response:", res.data);

      setData(res.data);

    } catch (err) {

      console.log("Patient Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Failed to load patient"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // Loading State
  // =========================================

  if (loading) {

    return (

      <Layout>

        <div className="flex items-center justify-center min-h-[60vh]">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6">

            <p className="text-lg text-gray-600">
              Loading patient profile...
            </p>

          </div>

        </div>

      </Layout>
    );
  }

  // =========================================
  // Error State
  // =========================================

  if (error) {

    return (

      <Layout>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">

          {error}

        </div>

      </Layout>
    );
  }

  // =========================================
  // No Data
  // =========================================

  if (!data) {

    return (

      <Layout>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

          <p className="text-gray-500">
            No patient data found
          </p>

        </div>

      </Layout>
    );
  }

  // =========================================
  // Data
  // =========================================

  const { patient, appointments, prescriptions } = data;

  // =========================================
  // Status Colors
  // =========================================

  const statusColors = {

    Pending:
      "bg-orange-100 text-orange-700",

    Completed:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

    Scheduled:
      "bg-blue-100 text-blue-700",
  };

  return (

    <Layout>

      <div className="space-y-6">

        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

        <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">

          <div>

            <p className="text-blue-200 text-sm mb-1">
              Patient Profile
            </p>

            <h1 className="text-3xl font-bold">

              {patient?.name || "Patient"}

            </h1>

            <p className="text-blue-200 mt-2 text-sm">

              {patient?.patient_id || "--"}

            </p>

          </div>

          <button
            onClick={() => navigate("/doctor/appointments")}
            className="bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
          >

            Back to Appointments

          </button>

        </div>

        {/* ========================================= */}
        {/* Patient Information */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-800">
              Patient Information
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Full Name
              </p>

              <p className="font-semibold text-gray-800">
                {patient?.name || "--"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Email Address
              </p>

              <p className="font-semibold text-gray-800">
                {patient?.email || "--"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Patient ID
              </p>

              <p className="font-semibold text-gray-800">
                {patient?.patient_id || "--"}
              </p>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* Appointment History */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-800">
              Appointment History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {appointments?.length || 0} appointment(s)
            </p>

          </div>

          {appointments?.length === 0 ? (

            <div className="py-12 text-center text-gray-500">

              No appointments found

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    {[
                      "Date",
                      "Time",
                      "Reason",
                      "Status",
                      "Token",
                    ].map((header) => (

                      <th
                        key={header}
                        className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50">

                  {appointments.map((a) => (

                    <tr
                      key={a.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4 text-gray-700">
                        {a.date || "--"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {a.time || "--"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {a.reason || "--"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[a.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >

                          {a.status || "--"}

                        </span>

                      </td>

                      <td className="px-5 py-4 font-semibold text-blue-700">

                        {a.token || "--"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ========================================= */}
        {/* Prescriptions */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Prescriptions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {prescriptions?.length || 0} prescription(s)
              </p>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/doctor/prescriptions/create/${patient?.id}`
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >

              Add Prescription

            </button>

          </div>

          {prescriptions?.length === 0 ? (

            <div className="py-12 text-center text-gray-500">

              No prescriptions found

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b border-gray-100">

                  <tr>

                    {[
                      "Date",
                      "Diagnosis",
                      "Medicines",
                      "Notes",
                    ].map((header) => (

                      <th
                        key={header}
                        className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50">

                  {prescriptions.map((p) => (

                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4 text-gray-700">
                        {p.date || "--"}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {p.diagnosis || "--"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {p.medicines || "--"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {p.notes || "--"}
                      </td>

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