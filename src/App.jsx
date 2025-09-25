// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  Navigate,
} from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import AppRoutes from "@/router";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/App.css";
import Loader from "./components/Loader";

const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const token = localStorage.getItem("token");

  // ✅ Auth Guard
  if (isLoginPage && token) {
    return <Navigate to="/" replace />;
  }
  if (!isLoginPage && !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Loader
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ لو صفحة اللوجين
  if (isLoginPage) {
    return (
      <main className="flex-1 bg-gray-50">
        {isLoading ? <Loader /> : <AppRoutes />}
      </main>
    );
  }

  // ✅ باقي الصفحات بالـ Layout
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <AppRoutes />
          )}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <MainLayout />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
