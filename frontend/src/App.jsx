import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Public ────────────────────────────────────────────────────────────────────
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";

// ── Departments ──────────────────────────────────────────────────────────────
import Departments from "./pages/public/Departments";
import DepartmentDetail from "./pages/public/DepartmentDetail";

// ── Doctor ────────────────────────────────────────────────────────────────────
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorPatientProfile from "./pages/doctor/DoctorPatientProfile";
import DoctorPrescriptionCreate from "./pages/doctor/DoctorPrescriptionCreate";
import DoctorPrescriptionEdit from "./pages/doctor/DoctorPrescriptionEdit";

// ── Receptionist ──────────────────────────────────────────────────────────────
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import ReceptionistPatients from "./pages/receptionist/ReceptionistPatients";
import ReceptionistPatientRegister from "./pages/receptionist/ReceptionistPatientRegister";
import ReceptionistPatientDetail from "./pages/receptionist/ReceptionistPatientDetail";
import ReceptionistAppointments from "./pages/receptionist/ReceptionistAppointments";
import ReceptionistCreateAppointment from "./pages/receptionist/ReceptionistCreateAppointment";
import ReceptionistWalkIn from "./pages/receptionist/ReceptionistWalkIn";
import ReceptionistVisitorLog from "./pages/receptionist/ReceptionistVisitorLog";
import ReceptionistCompletedConsultation from "./pages/receptionist/ReceptionistCompletedConsultation";

// ── Patient ───────────────────────────────────────────────────────────────────
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import PatientFeedback from "./pages/patient/PatientFeedback";
import PatientSupportTickets from "./pages/patient/PatientSupportTickets";

// ── Admin ─────────────────────────────────────────────────────────────────────
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminReceptionists from "./pages/admin/AdminReceptionists";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminCreateDoctor from "./pages/admin/AdminCreateDoctor";
import AdminCreateReceptionist from "./pages/admin/AdminCreateReceptionist";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";

// ── Billing ───────────────────────────────────────────────────────────────────
import BillingDashboard from "./pages/billing/BillingDashboard";
import BillsList from "./pages/billing/BillsList";
import BillDetail from "./pages/billing/BillDetail";
import CreateBill from "./pages/billing/CreateBill";
import PaymentsList from "./pages/billing/PaymentsList";
import CreatePayment from "./pages/billing/CreatePayment";
// ── Auth Guard ────────────────────────────────────────────────────────────────
function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    const redirects = {
      admin: "/admin/dashboard",
      receptionist: "/receptionist/dashboard",
      doctor: "/doctor/dashboard",
      patient: "/patient/dashboard",
    };

    return <Navigate to={redirects[user.role] || "/"} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ──────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── Departments ───────────────────────────────────── */}
        <Route path="/departments" element={<Departments />} />

        <Route
          path="/departments/:name"
          element={<DepartmentDetail />}
        />

        {/* ── Doctor ──────────────────────────────────────────── */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <PrivateRoute role="doctor">
              <DoctorAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <PrivateRoute role="doctor">
              <DoctorProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/patients/:pk"
          element={
            <PrivateRoute role="doctor">
              <DoctorPatientProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/prescriptions/create/:patientId"
          element={
            <PrivateRoute role="doctor">
              <DoctorPrescriptionCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/prescriptions/edit/:id"
          element={
            <PrivateRoute role="doctor">
              <DoctorPrescriptionEdit />
            </PrivateRoute>
          }
        />

        {/* ── Receptionist ────────────────────────────────────── */}
        <Route
          path="/receptionist/dashboard"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/patients"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistPatients />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/patients/register"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistPatientRegister />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/patients/:id"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistPatientDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/appointments"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/appointments/create"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistCreateAppointment />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/walkin"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistWalkIn />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/visitors"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistVisitorLog />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/completed-consultations"
          element={
            <PrivateRoute role="receptionist">
              <ReceptionistCompletedConsultation />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/payments/create/:billId"
          element={
            <PrivateRoute role="receptionist">
              <CreatePayment />
            </PrivateRoute>
          }
        />

        {/* ── Receptionist Billing ────────────────────────────── */}
        <Route
          path="/receptionist/billing"
          element={
            <PrivateRoute role="receptionist">
              <BillingDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/bills"
          element={
            <PrivateRoute role="receptionist">
              <BillsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/bills/:billId"
          element={
            <PrivateRoute role="receptionist">
              <BillDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/bills/create/:appointmentId"
          element={
            <PrivateRoute role="receptionist">
              <CreateBill />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/billing/create"
          element={
            <PrivateRoute role="receptionist">
              <CreateBill />
            </PrivateRoute>
          }
        />

        <Route
          path="/receptionist/payments"
          element={
            <PrivateRoute role="receptionist">
              <PaymentsList />
            </PrivateRoute>
          }
        />

        {/* ── Patient ─────────────────────────────────────────── */}
        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/profile"
          element={
            <PrivateRoute role="patient">
              <PatientProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/appointments"
          element={
            <PrivateRoute role="patient">
              <PatientAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/prescriptions"
          element={
            <PrivateRoute role="patient">
              <PatientPrescriptions />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/records"
          element={
            <PrivateRoute role="patient">
              <PatientMedicalRecords />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/feedback"
          element={
            <PrivateRoute role="patient">
              <PatientFeedback />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/tickets"
          element={
            <PrivateRoute role="patient">
              <PatientSupportTickets />
            </PrivateRoute>
          }
        />

        {/* ── Admin ───────────────────────────────────────────── */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <PrivateRoute role="admin">
              <AdminDoctors />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/doctors/create"
          element={
            <PrivateRoute role="admin">
              <AdminCreateDoctor />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <PrivateRoute role="admin">
              <AdminPatients />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/receptionists"
          element={
            <PrivateRoute role="admin">
              <AdminReceptionists />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/receptionists/create"
          element={
            <PrivateRoute role="admin">
              <AdminCreateReceptionist />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <PrivateRoute role="admin">
              <AdminAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <PrivateRoute role="admin">
              <AdminDepartments />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <PrivateRoute role="admin">
              <AdminActivityLogs />
            </PrivateRoute>
          }
        />

        {/* ── Admin Billing ───────────────────────────────────── */}
        <Route
          path="/admin/billing"
          element={
            <PrivateRoute role="admin">
              <BillingDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/bills"
          element={
            <PrivateRoute role="admin">
              <BillsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/bills/:billId"
          element={
            <PrivateRoute role="admin">
              <BillDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <PrivateRoute role="admin">
              <PaymentsList />
            </PrivateRoute>
          }
        />

        {/* ── Fallback ────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;