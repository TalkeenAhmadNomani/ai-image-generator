import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Navbar, AdminRoute } from "./components"; // Ensure AdminRoute is imported
import {
  Home,
  CreatePost,
  Login,
  Signup,
  PostDetail,
  ProfilePage,
  AdminDashboard,
} from "./pages";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toaster for notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

            {/* --- THIS IS THE FIX --- */}
            {/* The "*" allows this route to match /admin and any sub-path like /admin/stats */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
