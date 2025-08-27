import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FormField, Loader } from "../components";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await login(form, setError);
    setLoading(false);
  };

  return (
    <section className="max-w-xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Login</h1>
      </div>
      <form className="mt-16" onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Email"
            type="email"
            name="email"
            value={form.email}
            handleChange={handleChange}
          />
          <FormField
            labelName="Password"
            type="password"
            name="password"
            value={form.password}
            handleChange={handleChange}
          />
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="text-white bg-indigo-600 font-medium rounded-md text-sm w-full px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </div>
        <div className="mt-5 text-center text-[#666e75]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
