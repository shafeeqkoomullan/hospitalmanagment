import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorPatientProfile() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/doctor/patient/${id}/`);
      setData(res.data);

    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.error || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading patient...</div>;
  if (!data) return <div className="p-6 text-red-600">No data found</div>;

  const { patient, appointments, prescriptions } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Patient Info */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Patient Profile</h2>

        <div><b>Name:</b> {patient.name}</div>
        <div><b>Email:</b> {patient.email}</div>
        <div><b>Patient ID:</b> {patient.patient_id}</div>
      </div>

      {/* Appointments */}
      <div className="bg-white shadow p-6 rounded">
        <h3 className="font-semibold mb-4">Appointments</h3>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Token</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="p-2 border">{a.date}</td>
                  <td className="p-2 border">{a.time}</td>
                  <td className="p-2 border">{a.reason}</td>
                  <td className="p-2 border">{a.status}</td>
                  <td className="p-2 border">{a.token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Prescriptions */}
      <div className="bg-white shadow p-6 rounded">
        <h3 className="font-semibold mb-4">Prescriptions</h3>

        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions found</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Medicine</th>
                <th className="p-2 border">Dosage</th>
                <th className="p-2 border">Notes</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.date}</td>
                  <td className="p-2 border">{p.medicine}</td>
                  <td className="p-2 border">{p.dosage}</td>
                  <td className="p-2 border">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}