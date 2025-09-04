import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FormField } from "../components";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Get the location to redirect to after login, default to homepage "/"
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      await login(form);
      toast.success("Login successful!");
      // Navigate to the page the user was trying to access
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="font-extrabold text-[#222328] text-[32px]">Login</h1>
      <p className="mt-2 text-[#666e75] text-[16px]">
        Access your account to create and share images.
      </p>

      <form className="mt-16" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            handleChange={handleChange}
          />
          <FormField
            labelName="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            handleChange={handleChange}
          />
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#6469ff] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
