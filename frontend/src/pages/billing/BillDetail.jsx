import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function BillDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [bill, setBill] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================================
  // Fetch Bill
  // =========================================

  useEffect(() => {

    fetchBill();

  }, []);

  const fetchBill = async () => {

    try {

      const res = await api.get(
        `/billing/bills/${id}/`
      );

      setBill(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // =========================================
  // Helpers
  // =========================================

  const getStatusColor = (status) => {

    switch (status) {

      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-yellow-100 text-yellow-700";

      case "Overdue":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  return (

    <Layout>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <p className="text-sm text-gray-500 mb-2">
                Bill Details
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-gray-800
                "
              >

                Bill #{bill?.id}

              </h2>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/receptionist/payments/create/${bill?.id}`
                )
              }
              className="
                bg-teal-600
                hover:bg-teal-700
                text-white
                px-5
                py-3
                rounded-xl
                font-medium
                transition-all
              "
            >

              Record Payment

            </button>

          </div>

        </div>

        {loading ? (

          <div
            className="
              bg-white
              rounded-2xl
              p-10
              text-center
              text-gray-400
              shadow-sm
            "
          >

            Loading bill...

          </div>

        ) : bill ? (

          <>
            {/* =====================================
                Bill Summary
            ===================================== */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-8
              "
            >

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-8
                "
              >

                {/* Left */}

                <div className="space-y-5">

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Patient
                    </p>

                    <h3
                      className="
                        text-xl
                        font-semibold
                        text-gray-800
                      "
                    >

                      {bill.patient_name}

                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Bill Date
                    </p>

                    <h3 className="font-medium text-gray-700">

                      {bill.bill_date}

                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Due Date
                    </p>

                    <h3 className="font-medium text-gray-700">

                      {bill.due_date || "Not Set"}

                    </h3>

                  </div>

                </div>

                {/* Right */}

                <div className="space-y-5">

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Status
                    </p>

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${getStatusColor(bill.status)}
                      `}
                    >

                      {bill.status}

                    </span>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Total Amount
                    </p>

                    <h3
                      className="
                        text-3xl
                        font-bold
                        text-gray-800
                      "
                    >

                      ₹ {bill.amount}

                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500 mb-1">
                      Balance Due
                    </p>

                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-red-600
                      "
                    >

                      ₹ {bill.balance_due}

                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================
                Description
            ===================================== */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-8
              "
            >

              <h3
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                  mb-5
                "
              >

                Description

              </h3>

              <div
                className="
                  bg-gray-50
                  rounded-xl
                  p-5
                  text-gray-700
                  whitespace-pre-line
                "
              >

                {bill.description || "No description"}

              </div>

            </div>

            {/* =====================================
                Payments
            ===================================== */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-8
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

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-gray-800
                  "
                >

                  Payments

                </h3>

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >

                  {bill.payments?.length || 0} Payments

                </span>

              </div>

              {!bill.payments ||
              bill.payments.length === 0 ? (

                <div
                  className="
                    text-center
                    text-gray-400
                    py-10
                  "
                >

                  No payments recorded

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

                        <th className="px-5 py-3 text-left">
                          Receipt
                        </th>

                        <th className="px-5 py-3 text-left">
                          Amount
                        </th>

                        <th className="px-5 py-3 text-left">
                          Method
                        </th>

                        <th className="px-5 py-3 text-left">
                          Date
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-50">

                      {bill.payments.map((payment) => (

                        <tr key={payment.id}>

                          <td className="px-5 py-4 font-medium">
                            {payment.receipt_number}
                          </td>

                          <td className="px-5 py-4">
                            ₹ {payment.amount_paid}
                          </td>

                          <td className="px-5 py-4">
                            {payment.payment_method}
                          </td>

                          <td className="px-5 py-4 text-gray-500">
                            {payment.payment_date}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        ) : (

          <div
            className="
              bg-white
              rounded-2xl
              p-10
              text-center
              text-red-400
              shadow-sm
            "
          >

            Failed to load bill

          </div>

        )}

      </div>

    </Layout>

  );

}