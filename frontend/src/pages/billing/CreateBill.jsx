import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function CreateBill() {

  const { appointmentId } = useParams();

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [consultationFee, setConsultationFee] = useState("");

  const [medicineFee, setMedicineFee] = useState("");

  const [testFee, setTestFee] = useState("");

  const [loading, setLoading] = useState(true);

  // =========================================
  // Fetch Appointment
  // =========================================

  useEffect(() => {

    fetchAppointment();

  }, []);

  const fetchAppointment = async () => {

    try {

      const res = await api.get(
        `/appointments/${appointmentId}/`
      );

      setAppointment(res.data);

      setConsultationFee(
        res.data.doctor_fee || 0
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // =========================================
  // Create Bill
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {

        patient: appointment.patient_id,

        appointment: appointmentId,

        amount: total,

        description: `
            Consultation: ₹${consultationFee}
            Medicine: ₹${medicineFee || 0}
            Tests: ₹${testFee || 0}
          `,

    };

      await api.post(
        "/billing/bills/",
        payload
      );

      alert("Bill created successfully");

      navigate("/receptionist/dashboard");

    } catch (err) {

      console.log(err);

      alert("Failed to create bill");

    }

  };

  const total =
    Number(consultationFee || 0) +
    Number(medicineFee || 0) +
    Number(testFee || 0);

  return (

    <Layout>

      <div className="max-w-3xl mx-auto">

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          p-8
        ">

          <h2 className="
            text-3xl
            font-bold
            text-gray-800
            mb-2
          ">

            Create Bill

          </h2>

          <p className="text-gray-500 mb-8">

            Generate patient invoice

          </p>

          {loading ? (

            <div className="text-gray-400">
              Loading...
            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Patient */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">

                  Patient

                </label>

                <input
                  type="text"
                  value={appointment?.patient_name || ""}
                  disabled
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    bg-gray-50
                  "
                />

              </div>

              {/* Doctor */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">

                  Doctor

                </label>

                <input
                  type="text"
                  value={`Dr. ${appointment?.doctor_name || ""}`}
                  disabled
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    bg-gray-50
                  "
                />

              </div>

              {/* Consultation Fee */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">

                  Consultation Fee

                </label>

                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) =>
                    setConsultationFee(e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                  "
                />

              </div>

              {/* Medicine Fee */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">

                  Medicine Fee

                </label>

                <input
                  type="number"
                  value={medicineFee}
                  onChange={(e) =>
                    setMedicineFee(e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                  "
                />

              </div>

              {/* Test Fee */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">

                  Test Fee

                </label>

                <input
                  type="number"
                  value={testFee}
                  onChange={(e) =>
                    setTestFee(e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                  "
                />

              </div>

              {/* Total */}

              <div className="
                bg-teal-50
                rounded-2xl
                p-5
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-gray-700
                    font-medium
                  ">

                    Total Amount

                  </span>

                  <span className="
                    text-3xl
                    font-bold
                    text-teal-700
                  ">

                    ₹ {total}

                  </span>

                </div>

              </div>

              {/* Submit */}

              <button
                type="submit"
                className="
                  w-full
                  bg-teal-600
                  hover:bg-teal-700
                  text-white
                  py-3
                  rounded-xl
                  font-medium
                  transition-all
                "
              >

                Create Bill

              </button>

            </form>

          )}

        </div>

      </div>

    </Layout>

  );

}