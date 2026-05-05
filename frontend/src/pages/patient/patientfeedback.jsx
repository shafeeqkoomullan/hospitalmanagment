import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientFeedback() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: "", rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/receptionist/doctors/")
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.doctor) {
      setError("Please select a doctor.");
      return;
    }
    if (form.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/patients/feedback/", {
        doctor: form.doctor,
        rating: form.rating,
        comment: form.comment,
      });
      setSuccess(true);
      setForm({ doctor: "", rating: 0, comment: "" });
    } catch (err) {
      setError(
        err?.response?.data?.rating?.[0] ||
        err?.response?.data?.error ||
        "Failed to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <Layout>
      <div className="space-y-5 max-w-lg">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Give Feedback</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Rate your experience with our doctors
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-green-800">Thank you for your feedback!</p>
            <p className="text-sm text-green-600 mt-1">
              Your response helps us improve our services.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-green-700 border border-green-300 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              Submit Another
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                ⚠ {error}
              </div>
            )}

            {/* Doctor select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Doctor *
              </label>
              {fetching ? (
                <div className="text-gray-400 text-sm">Loading doctors...</div>
              ) : (
                <select
                  value={form.doctor}
                  onChange={set("doctor")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                >
                  <option value="">Choose your doctor...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.username} — {d.specialization || d.department_name || "General"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className={`w-12 h-12 rounded-xl text-2xl transition-all hover:scale-110 ${
                      form.rating >= n
                        ? "bg-yellow-400 shadow-sm"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
                {form.rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-gray-600">
                    {ratingLabels[form.rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.comment}
                onChange={set("comment")}
                rows={4}
                placeholder="Share your experience — what went well, what could be improved..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {form.comment.length} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-all"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          💡 Your feedback is anonymous to other patients and helps us maintain the highest standards of care.
        </div>
      </div>
    </Layout>
  );
}
