import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <form onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border-4 border-black rounded-3xl shadow-2xl bg-white flex flex-col gap-6"
      >
        <h2 className="text-3xl font-black text-center mb-2">Login</h2>
        {error && <div className="text-red-500 text-center font-bold">{error}</div>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="px-4 py-2 border-2 border-black rounded-full text-xl"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="px-4 py-2 border-2 border-black rounded-full text-xl"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-full py-2 font-bold text-lg border-2 border-blue-700 hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-gray-700 text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-blue-600 font-bold">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
