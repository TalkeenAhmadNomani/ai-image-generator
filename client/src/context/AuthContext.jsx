import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On initial app load, check if user data exists in localStorage
  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  const login = async (formData, setError) => {
    try {
      const { data } = await api.signIn(formData);
      localStorage.setItem("profile", JSON.stringify(data));
      setUser(data);
      navigate("/"); // Redirect to home on successful login
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const signup = async (formData, setError) => {
    try {
      await api.signUp(formData);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);
