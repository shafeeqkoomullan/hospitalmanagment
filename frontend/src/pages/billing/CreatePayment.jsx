import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function CreatePayment() {

  const { billId } = useParams();

  const navigate = useNavigate();

  const [bill, setBill] = useState(null);

  const [amountPaid, setAmountPaid] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // =========================================
  // Fetch Bill
  // =========================================

  useEffect(() => {

    fetchBill();

  }, []);

  const fetchBill = async () => {

    try {

      const res = await api.get(
        `/billing/bills/${billId}/`
      );

      console.log(res.data);

      setBill(res.data);

      setAmountPaid(
        res.data?.balance_due || 0
      );

    } catch (err) {

      console.log(err);

      alert("Failed to load bill");

    } finally {

      setLoading(false);

    }

  };

  // =========================================
  // Submit Payment
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const payload = {

        bill: billId,

        amount_paid: amountPaid,

        payment_method: paymentMethod,

        notes,

      };

      await api.post(
        "/billing/payments/",
        payload
      );

      alert("Payment recorded successfully");

      navigate(`/receptionist/bills/${billId}`);

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.detail ||
        "Failed to record payment"
      );

    } finally {

      setSubmitting(false);

    }

  };

  // =========================================
  // Status Colors
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
  // Loading
  // =========================================

  if (loading) {

    return (

      <Layout>

        <div
          className="
            bg-white
            rounded-2xl
            p-10
            shadow-sm
            text-center
            text-gray-400
          "
        >

          Loading payment page...

        </div>

      </Layout>

    );

  }

  // =========================================
  // Main UI
  // =========================================

  return (

    <Layout>

      <div className="max-w-3xl mx-auto space-y-6">

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
            Billing Payment
          </p>

          <h2
            className="text-4xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >

            Record Payment

          </h2>

          <p className="text-teal-200 text-sm mt-2">

            Add payment for bill #{bill?.id}

          </p>

        </div>

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
            p-6
          "
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

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

                {bill?.patient_name || "Unknown"}

              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Status
              </p>

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  ${getStatusColor(bill?.status)}
                `}
              >

                {bill?.status}

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

                ₹ {bill?.amount}

              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Balance Due
              </p>

              <h3
                className="
                  text-3xl
                  font-bold
                  text-red-600
                "
              >

                ₹ {bill?.balance_due}

              </h3>

            </div>

          </div>

        </div>

        {/* =====================================
            Payment Form
        ===================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            space-y-6
          "
        >

          {/* Amount */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >

              Amount Paid

            </label>

            <input
              type="number"
              value={amountPaid}
              onChange={(e) =>
                setAmountPaid(e.target.value)
              }
              required
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

          {/* Payment Method */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >

              Payment Method

            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
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
            >

              <option value="Cash">
                Cash
              </option>

              <option value="Card">
                Card
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Insurance">
                Insurance
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Notes */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >

              Notes

            </label>

            <textarea
              rows="4"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Optional notes..."
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

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="
                flex-1
                border
                border-gray-200
                hover:bg-gray-50
                text-gray-700
                py-3
                rounded-xl
                font-medium
                transition-all
              "
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                flex-1
                bg-teal-600
                hover:bg-teal-700
                text-white
                py-3
                rounded-xl
                font-medium
                transition-all
                disabled:opacity-50
              "
            >

              {submitting
                ? "Recording..."
                : "Record Payment"}

            </button>

          </div>

        </form>

      </div>

    </Layout>

  );

}