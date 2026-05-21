import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistDashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  // ============================================
  // Fetch Dashboard
  // ============================================

  const fetchDashboard = useCallback(async () => {

    try {

      const res = await api.get(
        "/receptionist/dashboard/"
      );

      setData(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }, []);

  // ============================================
  // Auto Refresh
  // ============================================

  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(() => {

      fetchDashboard();

    }, 10000);

    return () => clearInterval(interval);

  }, [fetchDashboard]);

  // ============================================
  // Stats
  // ============================================

  const stats = [

    {
      label: "Today's Appointments",
      value: data?.total_appointments ?? 0,
      color: "bg-teal-600",
      icon: "📅",
      path: "/receptionist/appointments",
    },

    {
      label: "Checked In",
      value: data?.checked_in ?? 0,
      color: "bg-green-600",
      icon: "✅",
      path: "/receptionist/appointments",
    },

    {
      label: "Walk-Ins",
      value: data?.walkins ?? 0,
      color: "bg-blue-600",
      icon: "🚶",
      path: "/receptionist/walkin",
    },

    {
      label: "Visitors",
      value: data?.visitors ?? 0,
      color: "bg-purple-600",
      icon: "👥",
      path: "/receptionist/visitors",
    },

  ];

  // ============================================
  // Quick Actions
  // ============================================

  const actions = [

    {
      label: "📅 Today's Appointments",
      path: "/receptionist/appointments",
      color:
        "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100",
    },

    {
      label: "➕ New Appointment",
      path: "/receptionist/appointments/create",
      color:
        "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    },

    {
      label: "🧑‍⚕️ Register Patient",
      path: "/receptionist/patients/register",
      color:
        "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },

    {
      label: "🚶 Walk-In",
      path: "/receptionist/walkin",
      color:
        "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
    },

    {
      label: "📋 Visitor Log",
      path: "/receptionist/visitors",
      color:
        "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100",
    },

    {
      label: "👥 All Patients",
      path: "/receptionist/patients",
      color:
        "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100",
    },

  ];

  return (

    <Layout>

      <div className="space-y-6">

        {/* ============================================
            Header
        ============================================ */}

        <div className="
          bg-gradient-to-r
          from-teal-700
          to-teal-600
          rounded-2xl
          p-6
          text-white
          shadow-md
        ">

          <p className="text-teal-200 text-sm mb-1">
            Today's Overview
          </p>

          <h2
            className="text-4xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Receptionist Dashboard

          </h2>

          <p className="text-teal-200 text-sm mt-2">
            {new Date().toDateString()}
          </p>

        </div>

        {/* ============================================
            Loading
        ============================================ */}

        {loading ? (

          <div className="
            bg-white
            rounded-2xl
            p-10
            text-center
            text-gray-400
            shadow-sm
          ">

            Loading dashboard...

          </div>

        ) : (

          <>

            {/* ============================================
                Stats
            ============================================ */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-5
            ">

              {stats.map((s) => (

                <button
                  key={s.label}
                  onClick={() => navigate(s.path)}
                  className={`
                    ${s.color}
                    text-white
                    rounded-2xl
                    p-5
                    text-left
                    hover:opacity-95
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-xl
                  `}
                >

                  <div className="text-4xl mb-3">
                    {s.icon}
                  </div>

                  <div className="text-4xl font-bold">
                    {s.value}
                  </div>

                  <div className="text-sm opacity-90 mt-2">
                    {s.label}
                  </div>

                </button>

              ))}

            </div>

            {/* ============================================
                Quick Actions
            ============================================ */}

            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-6
              shadow-sm
            ">

              <h3 className="
                font-semibold
                text-gray-800
                mb-5
                text-sm
                uppercase
                tracking-wider
              ">

                Quick Actions

              </h3>

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-4
              ">

                {actions.map((a) => (

                  <button
                    key={a.path}
                    onClick={() => navigate(a.path)}
                    className={`
                      ${a.color}
                      border
                      rounded-xl
                      px-4
                      py-4
                      text-sm
                      font-medium
                      transition-all
                      text-left
                      hover:shadow-md
                    `}
                  >

                    {a.label}

                  </button>

                ))}

              </div>

            </div>

            {/* ============================================
                Completed Consultations
            ============================================ */}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                    Completed Consultations
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Ready for billing
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate("/receptionist/completed-consultations")
                  }
                  className="
                    text-sm
                    text-teal-600
                    hover:text-teal-700
                    font-medium
                  "
                >

                  View All

                </button>

              </div>

              {/* Filter out already billed */}

              {(() => {

                const unbilled = (
                  data?.completed_consultations || []
                ).filter((a) => !a.has_bill);

                return unbilled.length === 0 ? (

                  <div className="text-center text-gray-400 py-10">

                    <div className="text-4xl mb-3">
                      ✅
                    </div>

                    <p className="text-sm">
                      All completed consultations have been billed
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-gray-50 border-b border-gray-100">

                        <tr>

                          {[
                            "Patient",
                            "Doctor",
                            "Token",
                            "Time",
                            "Action",
                          ].map((h) => (

                            <th
                              key={h}
                              className="
                                px-5
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-gray-500
                                uppercase
                                tracking-wider
                              "
                            >

                              {h}

                            </th>

                          ))}

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-gray-50">

                        {unbilled.map((ap) => (

                          <tr
                            key={ap.id}
                            className="hover:bg-gray-50 transition-all"
                          >

                            <td className="px-5 py-4 font-semibold text-gray-800">
                              {ap.patient_name}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              Dr. {ap.doctor_name}
                            </td>

                            <td className="px-5 py-4 font-mono font-bold text-teal-700">
                              #{ap.token}
                            </td>

                            <td className="px-5 py-4 text-gray-500">
                              {ap.time}
                            </td>

                            <td className="px-5 py-4">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/receptionist/bills/create/${ap.id}`
                                  )
                                }
                                className="
                                  bg-teal-600
                                  hover:bg-teal-700
                                  text-white
                                  text-xs
                                  px-4
                                  py-2
                                  rounded-xl
                                  transition-all
                                  font-medium
                                "
                              >

                                Create Bill

                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                );

              })()}

            </div>

          </>

        )}

      </div>

    </Layout>

  );

}