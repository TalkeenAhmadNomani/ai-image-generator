import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, CreatePost, Login, Signup } from "./pages";
import { Navbar } from "./components";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <BrowserRouter>
    {/* AuthProvider wraps the entire app, providing user context to all components */}
    <AuthProvider>
      <Navbar />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        {/* Routes define the different pages of your application */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
