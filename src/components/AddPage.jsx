import React, { useState, useEffect } from "react";

const AddPage = ({
  title = "Add Item",
  fields = [], // 👈 dynamic fields
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState({});

  // ✅ Sync initial data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      // default empty values for fields
      const defaults = fields.reduce((acc, field) => {
        if (field.type === "checkbox") acc[field.key] = false;
        else acc[field.key] = "";
        return acc;
      }, {});
      setFormData(defaults);
    }
  }, [initialData, fields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // ✅ Basic required validation
    for (let field of fields) {
      if (field.required && !formData[field.key]) {
        alert(`Please fill in ${field.label}`);
        return;
      }
    }
    onSubmit(formData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* Input types */}
            {field.type === "select" ? (
              <select
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={formData[field.key] || false}
                onChange={(e) => handleChange(field.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            ) : (
              <input
                type={field.type || "text"}
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPage;
