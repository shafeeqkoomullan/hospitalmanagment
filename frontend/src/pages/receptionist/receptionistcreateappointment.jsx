import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistCreateAppointment() {

  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    appointment_date: todayStr,
    appointment_time: "",
    reason: "",
  });

  // =========================================
  // Load Patients & Doctors
  // =========================================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const [patientRes, doctorRes] = await Promise.all([
        api.get("/receptionist/patients/"),
        api.get("/receptionist/doctors/"),
      ]);

      console.log("Patients:", patientRes.data);
      console.log("Doctors:", doctorRes.data);

      setPatients(patientRes.data || []);
      setDoctors(doctorRes.data || []);

    } catch (err) {

      console.log("Fetch Error:", err);
      console.log("Response:", err?.response);
      console.log("Data:", err?.response?.data);

      alert("Failed to load form data");
    }
  };

  // =========================================
  // Submit Appointment
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.patient ||
      !form.doctor ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post(
        "/receptionist/appointments/create/",
        form
      );

      alert(
        `Appointment created successfully. Token Number: ${res.data.token_number}`
      );

      navigate("/receptionist/appointments");

    } catch (err) {

      console.log("Submit Error:", err);
      console.log("Response:", err?.response);
      console.log("Data:", err?.response?.data);

      alert(
        err?.response?.data?.detail ||
        "Failed to create appointment"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Create Appointment
          </h1>

          <p className="text-gray-500 mt-2">
            Schedule a new appointment for a patient
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Patient + Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Patient */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Patient
              </label>

              <select
                value={form.patient}
                onChange={(e) =>
                  setForm({
                    ...form,
                    patient: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              >

                <option value="">
                  Choose Patient
                </option>

                {patients.map((p) => (

                  <option key={p.id} value={p.id}>

                    {(p.full_name ||
                      p.username ||
                      p.user?.username ||
                      "Unknown Patient")}

                    {p.patient_id
                      ? ` — ${p.patient_id}`
                      : ""}

                  </option>

                ))}

              </select>

            </div>

            {/* Doctor */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor
              </label>

              <select
                value={form.doctor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    doctor: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              >

                <option value="">
                  Choose Doctor
                </option>

                {doctors.map((d) => (

                  <option key={d.id} value={d.id}>

                    Dr.{" "}

                    {d.full_name ||
                      d.username ||
                      d.user?.username ||
                      d.email ||
                      "Unknown Doctor"}

                    {" — "}

                    {d.specialization ||
                      d.department_name ||
                      d.department?.name ||
                      "General"}

                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Date */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                value={form.appointment_date}
                min={todayStr}
                onChange={(e) =>
                  setForm({
                    ...form,
                    appointment_date: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />

            </div>

            {/* Time */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Time
              </label>

              <input
                type="time"
                value={form.appointment_time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    appointment_time: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />

            </div>

          </div>

          {/* Reason */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Appointment
            </label>

            <textarea
              rows="5"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              placeholder="Describe symptoms or appointment reason..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600"
            />

          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Creating Appointment..."
                : "Create Appointment"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/receptionist/appointments")
              }
              className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </Layout>
  );
}