// src/pages/ThemeAdd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePost from "@/hooks/usePost";
import Loader from "@/components/Loader";

export default function ThemeAdd() {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/themes/");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fileData: null, // file object
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", formData.name);
  form.append("description", formData.description);
  form.append("fileData", formData.fileData); // backend هيشوفه كـ file

  try {
    await postData(form, null, true); 
    toast.success("Theme added successfully!");
    navigate("/theme");
  } catch (err) {
    toast.error("Failed to add theme.",err);
    console.error(err);
  }
};


  return (
    <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Theme</h1>
      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Theme File</label>
          <input
            type="file"
            onChange={(e) => handleChange("fileData", e.target.files[0])}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/theme")}
            className="px-6 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
