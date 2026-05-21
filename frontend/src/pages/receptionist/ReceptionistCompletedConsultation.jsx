import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistCompletedConsultation() {

  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // Fetch Completed Consultations
  // =========================================

  useEffect(() => {

    fetchConsultations();

  }, []);

  const fetchConsultations = async () => {

    try {

      const res = await api.get(
        "/receptionist/dashboard/"
      );

      const completed = (
        res.data.completed_consultations || []
      ).filter((a) => !a.has_bill);

      setConsultations(completed);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <Layout>

      <div className="space-y-6">

        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            bg-gradient-to-r
            from-teal-700
            to-teal-600
            rounded-2xl
            p-6
            text-white
            shadow-md
          "
        >

          <p className="text-teal-200 text-sm mb-1">
            Billing Queue
          </p>

          <h2
            className="text-4xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Completed Consultations

          </h2>

          <p className="text-teal-200 text-sm mt-2">

            Ready for billing

          </p>

        </div>

        {/* =====================================
            Table
        ===================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  text-gray-800
                  text-sm
                  uppercase
                  tracking-wider
                "
              >

                Unbilled Consultations

              </h3>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >

                Completed appointments awaiting billing

              </p>

            </div>

          </div>

          {loading ? (

            <div
              className="
                text-center
                text-gray-400
                py-10
              "
            >

              Loading consultations...

            </div>

          ) : consultations.length === 0 ? (

            <div
              className="
                text-center
                text-gray-400
                py-10
              "
            >

              <div className="text-5xl mb-3">
                ✅
              </div>

              <p className="text-sm">
                All completed consultations have been billed
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead
                  className="
                    bg-gray-50
                    border-b
                    border-gray-100
                  "
                >

                  <tr>

                    <th
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

                      Patient

                    </th>

                    <th
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

                      Doctor

                    </th>

                    <th
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

                      Token

                    </th>

                    <th
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

                      Time

                    </th>

                    <th
                      className="
                        px-5
                        py-3
                        text-right
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >

                      Action

                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50">

                  {consultations.map((ap) => (

                    <tr
                      key={ap.id}
                      className="
                        hover:bg-gray-50
                        transition-all
                      "
                    >

                      <td
                        className="
                          px-5
                          py-4
                          font-semibold
                          text-gray-800
                        "
                      >

                        {ap.patient_name}

                      </td>

                      <td
                        className="
                          px-5
                          py-4
                          text-gray-600
                        "
                      >

                        Dr. {ap.doctor_name}

                      </td>

                      <td
                        className="
                          px-5
                          py-4
                          font-mono
                          font-bold
                          text-teal-700
                        "
                      >

                        #{ap.token}

                      </td>

                      <td
                        className="
                          px-5
                          py-4
                          text-gray-500
                        "
                      >

                        {ap.time}

                      </td>

                      <td
                        className="
                          px-5
                          py-4
                          text-right
                        "
                      >

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

          )}

        </div>

      </div>

    </Layout>

  );

}