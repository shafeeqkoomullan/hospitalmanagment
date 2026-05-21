import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function PaymentsList() {

  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // =========================================
  // Fetch Payments
  // =========================================

  const fetchPayments = async () => {

    try {

      const res = await api.get(
        "/billing/payments/"
      );

      setPayments(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchPayments();

  }, []);

  // =========================================
  // Filtered Payments
  // =========================================

  const filteredPayments = payments.filter((payment) => {

    const query = search.toLowerCase();

    return (

      payment?.patient_name
        ?.toLowerCase()
        .includes(query) ||

      payment?.receipt_number
        ?.toLowerCase()
        .includes(query) ||

      String(payment?.bill)
        .includes(query)

    );

  });

  // =========================================
  // Stats
  // =========================================

  const totalPayments = payments.length;

  const totalRevenue = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount_paid || 0),
    0
  );

  const cashPayments = payments.filter(
    (p) => p.payment_method === "Cash"
  ).length;

  const upiPayments = payments.filter(
    (p) => p.payment_method === "UPI"
  ).length;

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
            Financial Records
          </p>

          <h2
            className="text-4xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Payments

          </h2>

          <p className="text-teal-200 text-sm mt-2">
            Track and manage payment records
          </p>

        </div>

        {/* =====================================
            Stats
        ===================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
              shadow-sm
            "
          >

            <p className="text-sm text-gray-500">
              Total Payments
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-gray-800
                mt-2
              "
            >

              {totalPayments}

            </h3>

          </div>

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
              shadow-sm
            "
          >

            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-green-600
                mt-2
              "
            >

              ₹ {totalRevenue}

            </h3>

          </div>

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
              shadow-sm
            "
          >

            <p className="text-sm text-gray-500">
              Cash Payments
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-blue-600
                mt-2
              "
            >

              {cashPayments}

            </h3>

          </div>

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
              shadow-sm
            "
          >

            <p className="text-sm text-gray-500">
              UPI Payments
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-purple-600
                mt-2
              "
            >

              {upiPayments}

            </h3>

          </div>

        </div>

        {/* =====================================
            Search
        ===================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            p-5
            shadow-sm
          "
        >

          <input
            type="text"
            placeholder="
              Search by patient, receipt or bill ID...
            "
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-teal-500
            "
          />

        </div>

        {/* =====================================
            Payments Table
        ===================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            overflow-hidden
          "
        >

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

                  {[
                    "Receipt",
                    "Bill",
                    "Patient",
                    "Amount",
                    "Method",
                    "Date",
                    "Actions",
                  ].map((h) => (

                    <th
                      key={h}
                      className="
                        px-6
                        py-4
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

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        text-center
                        py-10
                        text-gray-400
                      "
                    >

                      Loading payments...

                    </td>

                  </tr>

                ) : filteredPayments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        text-center
                        py-10
                        text-gray-400
                      "
                    >

                      No payments found

                    </td>

                  </tr>

                ) : (

                  filteredPayments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="
                        hover:bg-gray-50
                        transition-all
                      "
                    >

                      <td
                        className="
                          px-6
                          py-5
                          font-semibold
                          text-gray-700
                        "
                      >

                        {payment.receipt_number}

                      </td>

                      <td className="px-6 py-5">

                        #{payment.bill}

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          font-medium
                          text-gray-800
                        "
                      >

                        {payment.patient_name || "Unknown"}

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          font-bold
                          text-green-600
                        "
                      >

                        ₹ {payment.amount_paid}

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className="
                            px-4
                            py-2
                            rounded-full
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            bg-blue-100
                            text-blue-700
                          "
                        >

                          {payment.payment_method || "Cash"}

                        </span>

                      </td>

                      <td className="px-6 py-5 text-gray-500">

                        {payment.payment_date}

                      </td>

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            navigate(
                              `/receptionist/bills/${payment.bill}`
                            )
                          }
                          className="
                            bg-gray-100
                            hover:bg-gray-200
                            text-gray-700
                            px-4
                            py-2
                            rounded-xl
                            text-xs
                            font-medium
                            transition-all
                          "
                        >

                          View Bill

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </Layout>

  );

}