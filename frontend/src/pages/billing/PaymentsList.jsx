import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function PaymentsList() {

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {

    try {

      const res = await api.get("/billing/payments/");

      setPayments(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchPayments();

  }, []);

  return (

    <Layout>

      <div className="space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Payments
          </h1>

          <p className="text-gray-500 mt-1">
            Track and manage payment records
          </p>

        </div>

        {/* Table */}

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Payment ID
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Bill ID
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Patient
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Amount Paid
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Method
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >

                      Loading payments...

                    </td>

                  </tr>

                ) : payments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >

                      No payments found

                    </td>

                  </tr>

                ) : (

                  payments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="border-b last:border-none hover:bg-gray-50 transition-all"
                    >

                      <td className="px-6 py-5 font-medium text-gray-700">
                        #{payment.id}
                      </td>

                      <td className="px-6 py-5">
                        #{payment.bill}
                      </td>

                      <td className="px-6 py-5">
                        {payment.patient_name || "Unknown"}
                      </td>

                      <td className="px-6 py-5 font-semibold text-green-600">
                        ₹ {payment.amount_paid}
                      </td>

                      <td className="px-6 py-5">

                        <span className="
                          px-4
                          py-2
                          rounded-full
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          bg-blue-100
                          text-blue-700
                        ">

                          {payment.payment_method || "Cash"}

                        </span>

                      </td>

                      <td className="px-6 py-5 text-gray-500">
                        {payment.payment_date}
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