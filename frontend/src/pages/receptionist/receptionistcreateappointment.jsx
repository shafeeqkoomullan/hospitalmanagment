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

  // =========================
  // Load patients + doctors
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientRes, doctorRes] = await Promise.all([
        api.get("/receptionist/patients/"),
        api.get("/receptionist/doctors/"),
      ]);

      setPatients(patientRes.data || []);
      setDoctors(doctorRes.data || []);

    } catch (err) {
      console.log(err);
      alert("Failed to load form data");
    }
  };

  // =========================
  // Submit appointment
  // =========================
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
      console.log(err);

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
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Appointment
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Schedule a new patient appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient
            </label>

            <select
              value={form.patient}
              onChange={(e) =>
                setForm({ ...form, patient: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">Select Patient</option>

              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.user?.username}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Doctor
            </label>

            <select
              value={form.doctor}
              onChange={(e) =>
                setForm({ ...form, doctor: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">Select Doctor</option>

              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.user?.username}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">
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
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
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
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason
            </label>

            <textarea
              rows="4"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              placeholder="Reason for appointment..."
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Appointment"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/receptionist/appointments")}
              className="border border-gray-300 px-5 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </Layout>
  );
}