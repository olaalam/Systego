import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";

const AddPage = ({
  title = "Add Item",
  description = "Fill in the details below to add a new record.",
  fields = [],
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const filteredData = fields.reduce((acc, field) => {
        acc[field.key] =
          initialData[field.key] !== undefined
            ? initialData[field.key]
            : field.type === "checkbox"
            ? false
            : "";
        return acc;
      }, {});
      setFormData(filteredData);
    } else {
      const defaults = fields.reduce((acc, field) => {
        acc[field.key] = field.type === "checkbox" ? false : "";
        return acc;
      }, {});
      setFormData(defaults);
    }
  }, [JSON.stringify(initialData), fields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Handle image upload and convert to base64
  const handleImageChange = async (key, file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to read image file", error);
    }
  };

  const handleSubmit = () => {
    // ✅ Basic required validation
    for (let field of fields) {
      if (field.required && !formData[field.key]) {
        toast.error(`Please fill in ${field.label}`);
        return;
      }
    }

    // ✅ Special case: date validation
    if (formData.from && formData.to) {
      const fromDate = new Date(formData.from);
      const toDate = new Date(formData.to);

      if (fromDate > toDate) {
        toast.error("Valid From date cannot be later than Valid To date");
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
          <UserPlus size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData[field.key] || false}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
              ) : field.type === "image" ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(field.key, e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData[field.key] && (
                    <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={formData[field.key]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium disabled:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPage;