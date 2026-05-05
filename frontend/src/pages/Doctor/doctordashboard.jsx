import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // You can later replace these with real endpoints
      const res = await api.get("/doctor/dashboard/");

      setStats({
        totalPatients: res.data.total_patients || 0,
        totalAppointments: res.data.total_appointments || 0,
        todayAppointments: res.data.today_appointments || 0,
      });

      setAppointments(res.data.today_list || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-gray-500">Total Patients</h4>
          <p className="text-2xl font-bold">{stats.totalPatients}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-gray-500">Total Appointments</h4>
          <p className="text-2xl font-bold">{stats.totalAppointments}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-gray-500">Today's Appointments</h4>
          <p className="text-2xl font-bold">{stats.todayAppointments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/doctor/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Profile
        </button>

        <button
          onClick={() => navigate("/doctor/patients")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Patients
        </button>

        <button
          onClick={() => navigate("/doctor/appointments")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Appointments
        </button>
      </div>

      {/* Today Appointments */}
      <div className="bg-white shadow p-6 rounded">
        <h3 className="font-semibold mb-4">Today's Appointments</h3>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments today</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a, index) => (
                <tr key={index}>
                  <td className="p-2 border">{a.patient_name}</td>
                  <td className="p-2 border">{a.time}</td>
                  <td className="p-2 border">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}