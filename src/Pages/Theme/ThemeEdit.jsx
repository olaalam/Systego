// src/pages/ThemeEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";

export default function ThemeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { putData, loading } = usePut(`/api/admin/themes/${id}`);
  const { data, loading: fetchLoading } = useGet(`/api/admin/themes/${id}`);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fileData: null,
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        description: data.data.description || "",
        fileData: null, // مش هنجيب الملف القديم
      });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (formData.fileData) {
      form.append("fileData", formData.fileData);
    }

    try {
      await putData(form);
      toast.success("Theme updated successfully!");
      navigate("/theme");
    } catch (err) {
      toast.error("Failed to update theme.");
      console.error(err);
    }
  };

  if (fetchLoading) return <Loader />;

  return (
    <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Theme</h1>
      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme File
          </label>
          <input
            type="file"
            onChange={(e) =>
              handleChange("fileData", e.target.files[0] || null)
            }
            className="w-full border px-3 py-2 rounded-lg"
          />
          {data?.data?.fileName && !formData.fileData && (
            <p className="text-xs text-gray-500 mt-1">
              Current file:{" "}
              <span className="font-medium">{data.data.fileName}</span>
            </p>
          )}
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
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
