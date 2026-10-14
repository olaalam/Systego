// src/Pages/Admins/CreateAdmin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import api from "@/api/api";
import { ArrowLeft, UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super_admin", "viewer"]),
});

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "viewer",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/api/admin/auth/create-admin", data);
      toast.success("Admin created successfully!");
      reset();

      // ✅ اختياري: روح على قائمة الـ Admins
      // navigate("/admins");
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to create admin";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
            <UserPlus size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Create Admin
            </h1>
            <p className="text-sm text-gray-500">
              Add a new super admin or viewer
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter admin name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="viewer">Viewer (Read-only + Notes)</option>
              <option value="super_admin">Super Admin (Full Access)</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
