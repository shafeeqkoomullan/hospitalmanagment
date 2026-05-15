import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function AdminCreateReceptionist() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    shift: "Morning",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Submitting:", form);

      const res = await api.post(
        "/admin-panel/create-receptionist/",
        form
      );

      console.log("Success:", res.data);

      navigate("/admin/receptionists");

    } catch (err) {

      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err?.response);
      console.log("ERROR DATA:", err?.response?.data);

      const data = err?.response?.data;

      if (typeof data === "string") {
        setError(data);
      }

      else if (data?.detail) {
        setError(data.detail);
      }

      else if (data?.error) {
        setError(data.error);
      }

      else if (data?.message) {
        setError(data.message);
      }

      else if (data?.username?.length) {
        setError(data.username[0]);
      }

      else if (data?.email?.length) {
        setError(data.email[0]);
      }

      else if (data?.password?.length) {
        setError(data.password[0]);
      }

      else {
        setError("Failed to create receptionist.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-teal-700 hover:underline mb-3"
          >
            ← Back
          </button>

          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Create Receptionist
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new receptionist account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={submit}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5"
        >

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>

            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              required
              placeholder="receptionist_01"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
                focus:border-teal-600
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              required
              placeholder="receptionist@hospital.com"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
                focus:border-teal-600
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              required
              placeholder="Minimum 8 characters"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500/20
                focus:border-teal-600
              "
            />
          </div>

          {/* Shift */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shift
            </label>

            <div className="grid grid-cols-3 gap-3">

              {["Morning", "Evening", "Night"].map((shift) => (

                <button
                  key={shift}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      shift,
                    })
                  }
                  className={`
                    py-3
                    rounded-xl
                    border
                    text-sm
                    font-medium
                    transition-all

                    ${
                      form.shift === shift
                        ? "bg-teal-700 border-teal-700 text-white"
                        : "border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700"
                    }
                  `}
                >
                  {shift === "Morning"
                    ? "🌅"
                    : shift === "Evening"
                    ? "🌆"
                    : "🌙"}

                  {" "}

                  {shift}
                </button>

              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                bg-teal-700
                hover:bg-teal-800
                disabled:bg-teal-400
                disabled:cursor-not-allowed
                text-white
                py-3
                rounded-xl
                font-semibold
                transition-all
              "
            >
              {loading
                ? "Creating..."
                : "Create Receptionist"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                px-6
                border
                border-gray-300
                rounded-xl
                text-gray-600
                hover:bg-gray-50
                transition-all
              "
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </Layout>
  );
}