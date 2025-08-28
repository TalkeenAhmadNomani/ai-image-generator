import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster
import {
  Home,
  CreatePost,
  Login,
  Signup,
  PostDetail,
  ProfilePage,
  AdminDashboard,
} from "./pages";
import { Navbar } from "./components";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute"; // Import the new protected route

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      {/* Add the Toaster component here */}
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

          {/* Admin Route */}
          <Route
            path="/admin/dashboard"
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

export default App;
