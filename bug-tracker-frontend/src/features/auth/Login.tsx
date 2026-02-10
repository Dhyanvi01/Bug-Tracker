import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../app/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ BACKEND EXPECTS: email + password (JSON)
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { access_token } = res.data;

      // ✅ SAVE TOKEN
      localStorage.setItem("access_token", access_token);

      // ✅ UPDATE AUTH CONTEXT
      login({
        token: access_token,
        user: {
          id: 1, // temporary, replace with /me later
          name: email.split("@")[0],
          email,
          role: "developer",
        },
      });

      navigate("/issues");

    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid credentials");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Login
        </h1>

        {error && (
          <div className="mb-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
