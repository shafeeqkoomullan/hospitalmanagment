import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function BillsList() {

  const navigate = useNavigate();

  const [bills, setBills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  // =========================================
  // Fetch Bills
  // =========================================

  const fetchBills = async () => {

    try {

      let url = "/billing/bills/";

      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const res = await api.get(url);

      setBills(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchBills();

  }, [statusFilter]);

  // =========================================
  // Helpers
  // =========================================

  const getStatusColor = (status) => {

    switch (status) {

      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-yellow-100 text-yellow-700";

      case "Unpaid":
        return "bg-red-100 text-red-700";

      case "Overdue":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  // =========================================
  // Stats
  // =========================================

  const totalBills = bills.length;

  const paidBills = bills.filter(
    (b) => b.status === "Paid"
  ).length;

  const unpaidBills = bills.filter(
    (b) => b.status === "Unpaid"
  ).length;

  const totalRevenue = bills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
    0
  );

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
            Billing Management
          </p>

          <h2
            className="text-4xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Bills

          </h2>

          <p className="text-teal-200 text-sm mt-2">
            Manage patient billing records
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
              Total Bills
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-gray-800
                mt-2
              "
            >

              {totalBills}

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
              Paid Bills
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-green-600
                mt-2
              "
            >

              {paidBills}

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
              Unpaid Bills
            </p>

            <h3
              className="
                text-4xl
                font-bold
                text-red-600
                mt-2
              "
            >

              {unpaidBills}

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
                text-teal-700
                mt-2
              "
            >

              ₹ {totalRevenue}

            </h3>

          </div>

        </div>

        {/* =====================================
            Filters
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

          <div className="flex flex-wrap gap-4 items-center">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-teal-500
              "
            >

              <option value="">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Partial">
                Partial
              </option>

              <option value="Unpaid">
                Unpaid
              </option>

              <option value="Overdue">
                Overdue
              </option>

            </select>

          </div>

        </div>

        {/* =====================================
            Bills Table
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
                    "Bill ID",
                    "Patient",
                    "Amount",
                    "Status",
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
                      colSpan="6"
                      className="
                        text-center
                        py-10
                        text-gray-400
                      "
                    >

                      Loading bills...

                    </td>

                  </tr>

                ) : bills.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="
                        text-center
                        py-10
                        text-gray-400
                      "
                    >

                      No bills found

                    </td>

                  </tr>

                ) : (

                  bills.map((bill) => (

                    <tr
                      key={bill.id}
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

                        #{bill.id}

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          font-medium
                          text-gray-800
                        "
                      >

                        {bill.patient_name || "Unknown"}

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          font-bold
                          text-gray-800
                        "
                      >

                        ₹ {bill.amount}

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`
                            px-4
                            py-2
                            rounded-full
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            ${getStatusColor(bill.status)}
                          `}
                        >

                          {bill.status}

                        </span>

                      </td>

                      <td className="px-6 py-5 text-gray-500">
                        {bill.bill_date}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/receptionist/bills/${bill.id}`
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

                            View

                          </button>

                          {bill.status !== "Paid" && (

                            <button
                              onClick={() =>
                                navigate(
                                  `/receptionist/payments/create/${bill.id}`
                                )
                              }
                              className="
                                bg-teal-600
                                hover:bg-teal-700
                                text-white
                                px-4
                                py-2
                                rounded-xl
                                text-xs
                                font-medium
                                transition-all
                              "
                            >

                              Payment

                            </button>

                          )}

                        </div>

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