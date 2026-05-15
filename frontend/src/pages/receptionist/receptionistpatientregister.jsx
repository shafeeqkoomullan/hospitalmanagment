import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ReceptionistPatientRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    gender: "other",
    age: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      alert("Patient name is required");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/receptionist/patients/register/", form);

      alert("Patient registered successfully");

      navigate("/receptionist/patients");

    } catch (err) {
      console.log(err);

      const data = err?.response?.data;

      if (data?.phone) {
        alert(data.phone);
      } else if (data?.full_name) {
        alert(data.full_name);
      } else {
        alert("Registration failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Register Patient
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Create a new patient profile
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter patient full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
              />
            </div>

          </div>

          {/* Gender + Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
              />
            </div>

          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>

            <select
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>

            <input
              type="text"
              name="emergency_contact"
              value={form.emergency_contact}
              onChange={handleChange}
              placeholder="Emergency contact number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Patient"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/receptionist/patients")}
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </Layout>
  );
}
