import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function BillingDashboard() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {

    try {

      const res = await api.get("/billing/dashboard/");

      setData(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  const stats = [

    {
      label: "Daily Earnings",
      value: `₹ ${data?.daily_earnings || 0}`,
      color: "bg-green-600",
      icon: "💰",
    },

    {
      label: "Monthly Earnings",
      value: `₹ ${data?.monthly_earnings || 0}`,
      color: "bg-teal-600",
      icon: "📈",
    },

    {
      label: "Total Bills",
      value: data?.bills?.total || 0,
      color: "bg-blue-600",
      icon: "🧾",
    },

    {
      label: "Pending Amount",
      value: `₹ ${data?.unpaid_amount || 0}`,
      color: "bg-red-600",
      icon: "⚠️",
    },
  ];

  const actions = [

    {
      label: "🧾 View Bills",
      path: "/receptionist/bills",
      color:
        "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    },

    {
      label: "💰 View Payments",
      path: "/receptionist/payments",
      color:
        "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },

    {
      label: "📅 Appointments",
      path: "/receptionist/appointments",
      color:
        "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100",
    },

    {
      label: "🧑‍⚕️ Patients",
      path: "/receptionist/patients",
      color:
        "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100",
    },
  ];

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

  if (loading) {

    return (
      <Layout>
        <div className="text-gray-500">
          Loading billing dashboard...
        </div>
      </Layout>
    );
  }

  return (

    <Layout>

      <div className="space-y-6">

        {/* Header */}

        <div className="
          bg-gradient-to-r
          from-teal-700
          to-teal-600
          rounded-xl
          p-6
          text-white
          shadow-md
        ">

          <p className="text-teal-200 text-sm mb-1">
            Financial Overview
          </p>

          <h2
            className="text-3xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Billing Dashboard

          </h2>

          <p className="text-teal-200 text-sm mt-2">
            Monitor bills, payments and revenue
          </p>

        </div>

        {/* Stats */}

        <div className="flex flex-wrap gap-5">

          {stats.map((s) => (

            <div
              key={s.label}
              className={`
                ${s.color}
                flex-1
                min-w-[220px]
                text-white
                rounded-xl
                p-5
                shadow-md
              `}
            >

              <div className="text-3xl mb-2">
                {s.icon}
              </div>

              <div className="text-3xl font-bold">
                {s.value}
              </div>

              <div className="text-sm opacity-90 mt-1">
                {s.label}
              </div>

            </div>

          ))}

        </div>

        {/* Quick Actions */}

        <div className="
          bg-white
          rounded-xl
          border
          border-gray-100
          p-6
          shadow-sm
        ">

          <h3 className="
            font-semibold
            text-gray-800
            mb-4
            text-sm
            uppercase
            tracking-wider
          ">

            Quick Actions

          </h3>

          <div className="flex flex-wrap gap-3">

            {actions.map((a) => (

              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`
                  ${a.color}
                  flex-1
                  min-w-[220px]
                  border
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  text-left
                `}
              >

                {a.label}

              </button>

            ))}

          </div>

        </div>

        {/* Bill Status */}

        <div className="
          bg-white
          rounded-xl
          border
          border-gray-100
          p-6
          shadow-sm
        ">

          <h3 className="
            font-semibold
            text-gray-800
            mb-6
            text-sm
            uppercase
            tracking-wider
          ">

            Bill Status Summary

          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-green-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">
                Paid
              </p>

              <h3 className="text-2xl font-bold text-green-600 mt-2">
                {data.bills.paid}
              </h3>
            </div>

            <div className="bg-yellow-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">
                Partial
              </p>

              <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                {data.bills.partial}
              </h3>
            </div>

            <div className="bg-red-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">
                Unpaid
              </p>

              <h3 className="text-2xl font-bold text-red-600 mt-2">
                {data.bills.unpaid}
              </h3>
            </div>

            <div className="bg-orange-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">
                Overdue
              </p>

              <h3 className="text-2xl font-bold text-orange-600 mt-2">
                {data.bills.overdue}
              </h3>
            </div>

          </div>

        </div>

        {/* Recent Bills */}

        <div className="
          bg-white
          rounded-xl
          border
          border-gray-100
          p-6
          shadow-sm
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-6
          ">

            <h3 className="
              font-semibold
              text-gray-800
              text-sm
              uppercase
              tracking-wider
            ">

              Recent Bills

            </h3>

            <button
              onClick={() => navigate("/receptionist/bills")}
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

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Patient
                  </th>

                  <th className="text-left py-3">
                    Amount
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                  <th className="text-left py-3">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.recent_bills.map((bill) => (

                  <tr
                    key={bill.id}
                    className="
                      border-b
                      last:border-none
                      hover:bg-gray-50
                      cursor-pointer
                      transition-all
                    "
                  >

                    <td className="py-4">
                      {bill.patient_name}
                    </td>

                    <td className="py-4 font-semibold">
                      ₹ {bill.amount}
                    </td>

                    <td className="py-4">

                      <span
                        className={`
                          px-3
                          py-1
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

                    <td className="py-4 text-gray-500">
                      {bill.bill_date}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </Layout>

  );
}