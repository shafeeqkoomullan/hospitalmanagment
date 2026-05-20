import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function BillsList() {

  const [bills, setBills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  const fetchBills = async () => {

    try {

      let url = "/billing/bills/";

      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const res = await api.get(url);

      setBills(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchBills();

  }, [statusFilter]);

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

  return (

    <Layout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Bills
            </h1>

            <p className="text-gray-500 mt-1">
              Manage patient billing records
            </p>

          </div>

        </div>

        {/* Filters */}

        <div className="bg-white p-5 rounded-3xl border shadow-sm">

          <div className="flex flex-wrap gap-4 items-center">

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                border
                border-gray-300
                rounded-2xl
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

        {/* Table */}

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Bill ID
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Patient
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-600">
                    Status
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
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >

                      Loading bills...

                    </td>

                  </tr>

                ) : bills.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >

                      No bills found

                    </td>

                  </tr>

                ) : (

                  bills.map((bill) => (

                    <tr
                      key={bill.id}
                      className="border-b last:border-none hover:bg-gray-50 transition-all"
                    >

                      <td className="px-6 py-5 font-medium text-gray-700">
                        #{bill.id}
                      </td>

                      <td className="px-6 py-5">
                        {bill.patient_name || "Unknown"}
                      </td>

                      <td className="px-6 py-5 font-semibold">
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