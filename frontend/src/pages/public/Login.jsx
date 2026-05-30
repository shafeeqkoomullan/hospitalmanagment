import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ROLE_REDIRECTS = {
  admin:        "/admin/dashboard",
  receptionist: "/receptionist/dashboard",
  doctor:       "/doctor/dashboard",
  patient:      "/patient/dashboard",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || data?.detail || "Invalid credentials.");
        return;
      }

      if (!data.access) {
        setError("Login failed. Unexpected response from server.");
        return;
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(ROLE_REDIRECTS[data.user?.role] || "/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center px-4">

      {/* Back to home */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 font-medium transition-colors"
      >
        ← Care Hospital
      </Link>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-teal-700 mb-0.5" style={{ fontFamily: "Georgia, serif" }}>
            Care Hospital
          </div>
          <div className="text-[10px] tracking-[4px] text-gray-400 uppercase">
            Multispeciality
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>

          </form>

        </div>

        {/* Contact help */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Need help?{" "}
          <a href="tel:04953069000" className="text-teal-600 hover:text-teal-700 font-medium">
            Call 0495 3069000
          </a>
        </p>

      </div>
    </div>
  );
}
