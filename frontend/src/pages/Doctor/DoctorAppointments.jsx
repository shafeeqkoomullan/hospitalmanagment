import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function DoctorAppointments() {

  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [appointments, setAppointments] = useState([]);

  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ======================================================
  // Fetch Appointments
  // ======================================================

  const fetchAppointments = async (dateValue) => {

    try {

      setLoading(true);

      setError("");

      const res = await api.get(
        `/doctorapp/appointments/by-date/?date=${dateValue}`
      );

      console.log("Appointments Response:", res.data);

      setAppointments(res.data?.results || []);

      setCount(res.data?.count || 0);

    } catch (err) {

      console.log("Appointments Error:", err);

      console.log("Response:", err?.response);

      console.log("Data:", err?.response?.data);

      setError(
        err?.response?.data?.error ||
        "Unable to load appointments"
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // Load Appointments
  // ======================================================

  useEffect(() => {

    fetchAppointments(selectedDate);

  }, [selectedDate]);

  // ======================================================
  // Complete Appointment
  // ======================================================

  const completeAppointment = async (appointmentId) => {

    try {

      await api.post(
        `/doctorapp/appointments/${appointmentId}/complete/`
      );

      alert("Appointment completed");

      fetchAppointments(selectedDate);

    } catch (err) {

      console.log("Complete Error:", err);

      alert(
        err?.response?.data?.error ||
        "Failed to complete appointment"
      );
    }
  };

  // ======================================================
  // Status Colors
  // ======================================================

  const statusStyles = {

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

        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">

              My Appointments

            </h1>

            <p className="text-gray-500 mt-1">

              View and manage patient appointments

            </p>

          </div>

          {/* Date Picker */}

          <div className="flex items-center gap-3">

            <label className="text-sm font-medium text-gray-600">

              Select Date

            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

        </div>

        {/* ====================================================== */}
        {/* Summary Card */}
        {/* ====================================================== */}

        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white shadow-sm">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <p className="text-blue-100 text-sm">

                Total Appointments

              </p>

              <h2 className="text-4xl font-bold mt-2">

                {count}

              </h2>

            </div>

            <div className="text-right">

              <p className="text-blue-100 text-sm">

                Selected Date

              </p>

              <h3 className="text-xl font-semibold mt-2">

                {selectedDate}

              </h3>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Loading */}
        {/* ====================================================== */}

        {loading && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">

            <p className="text-gray-600">

              Loading appointments...

            </p>

          </div>

        )}

        {/* ====================================================== */}
        {/* Error */}
        {/* ====================================================== */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">

            {error}

          </div>

        )}

        {/* ====================================================== */}
        {/* Appointment Table */}
        {/* ====================================================== */}

        {!loading && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Table Header */}

            <div className="px-6 py-5 border-b border-gray-100">

              <h2 className="text-xl font-semibold text-gray-800">

                Appointment List

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                {appointments.length} appointment(s)

              </p>

            </div>

            {/* Empty State */}

            {appointments.length === 0 ? (

              <div className="py-16 text-center">

                <div className="text-5xl mb-4">
                  📅
                </div>

                <p className="text-lg text-gray-500">

                  No appointments found

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b border-gray-100">

                    <tr>

                      {[
                        "Time",
                        "Patient",
                        "Patient ID",
                        "Token",
                        "Status",
                        "Prescription",
                        "Actions",
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

                    {appointments.map((ap) => {

                      console.log("Appointment:", ap);

                      return (

                        <tr
                          key={ap.id}
                          className="hover:bg-gray-50 transition"
                        >

                          {/* Time */}

                          <td className="px-5 py-4 text-gray-700">

                            {ap.appointment_time || "--"}

                          </td>

                          {/* Patient */}

                          <td
                            onClick={() => {

                              if (!ap.patient) {

                                alert(
                                  "Patient ID missing from backend response"
                                );

                                return;
                              }

                              navigate(
                                `/doctor/patients/${ap.patient}`
                              );
                            }}
                            className="px-5 py-4 font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                          >

                            {ap.patient_name || "--"}

                          </td>

                          {/* Patient ID */}

                          <td className="px-5 py-4 text-gray-500">

                            {ap.patient_code || "--"}

                          </td>

                          {/* Token */}

                          <td className="px-5 py-4 font-semibold text-gray-800">

                            {ap.token_number || "--"}

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[ap.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >

                              {ap.status || "--"}

                            </span>

                          </td>

                          {/* Prescription */}

                          <td className="px-5 py-4">

                            {ap.has_prescription ? (

                              <span className="text-green-700 font-medium">

                                Available

                              </span>

                            ) : (

                              <span className="text-orange-600 font-medium">

                                Not Added

                              </span>

                            )}

                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">

                            <div className="flex flex-wrap gap-2">

                              {/* Complete */}

                              {ap.status !== "Completed" && (

                                <button
                                  onClick={() =>
                                    completeAppointment(ap.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                                >

                                  Complete

                                </button>

                              )}

                              {/* Add Prescription */}

                              {!ap.has_prescription ? (

                                <button
                                  onClick={() => {

                                    if (!ap.patient) {

                                      alert(
                                        "Patient ID missing from backend response"
                                      );

                                      return;
                                    }

                                    navigate(
                                      `/doctor/prescriptions/create/${ap.patient}`
                                    );
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                                >

                                  Add Prescription

                                </button>

                              ) : (

                                <button
                                  onClick={() => {

                                    if (!ap.patient) {

                                      alert(
                                        "Patient ID missing from backend response"
                                      );

                                      return;
                                    }

                                    navigate(
                                      `/doctor/prescriptions/edit/${ap.patient}`
                                    );
                                  }}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                                >

                                  Edit Prescription

                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </div>

    </Layout>
  );
}