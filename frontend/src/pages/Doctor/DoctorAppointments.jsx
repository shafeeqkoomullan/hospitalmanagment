import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorAppointments() {
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [appointments, setAppointments] = useState([]);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = async (dateValue) => {
    try {
      setLoading(true);
      const res = await api.get(`/doctor/appointments/by-date/?date=${dateValue}`);
      setAppointments(res.data?.results || []);
      setCount(res.data?.count || 0);
    } catch {
      setError("Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const completeAppointment = async (id) => {
    await api.post(`/doctor/appointments/${id}/complete/`);
    fetchAppointments(selectedDate);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">My Appointments</h2>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <table className="w-full text-sm bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Time</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Token</th>
            <th className="p-2">Status</th>
            <th className="p-2">Prescription</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((ap) => (
            <tr key={ap.id} className="border-t">
              <td className="p-2">{ap.appointment_time}</td>
              <td
                className="p-2 text-blue-600 cursor-pointer"
                onClick={() => navigate(`/doctor/patients/${ap.patient_pk}`)}
              >
                {ap.patient_name}
              </td>
              <td className="p-2">{ap.token_number}</td>
              <td className="p-2">{ap.status}</td>
              <td className="p-2">{ap.has_prescription ? "Yes" : "No"}</td>
              <td className="p-2 space-x-2">
                {ap.status !== "completed" && (
                  <button
                    onClick={() => completeAppointment(ap.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Complete
                  </button>
                )}

                {!ap.has_prescription ? (
                  <button
                    onClick={() =>
                      navigate(`/doctor/prescriptions/create/${ap.patient_pk}`)
                    }
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Add Prescription
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/doctor/prescriptions/edit/${ap.patient_pk}`)
                    }
                    className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit Prescription
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
