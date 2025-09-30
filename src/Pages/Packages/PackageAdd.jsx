// src/pages/packageAdd.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const PackageAdd = () => {
  const navigate = useNavigate();

  const fields = [
    { key: "name", label: "package Name", required: true },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "monthly_price",
      label: "monthly_price",
      type: "number",
      required: true,
    },
    {
      key: "quarterly_price",
      label: "quarterly_price",
      type: "number",
      required: true,
    },
    {
      key: "yearly_price",
      label: "yearly_price",
      type: "number",
      required: true,
    },
    {
      key: "half_yearly_price",
      label: "half_yearly_price",
      type: "number",
      required: true,
    },

    { key: "status", label: "Active", type: "checkbox" },
  ];

  const handleSubmit = async (data) => {
    try {
      await api.post("/api/admin/packages/add", data);
      toast.success("package added successfully!");
      navigate("/packages"); // 👈 رجوع لصفحة الكوبونات
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add package");
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add package"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/packages")}
        initialData={{ status: true }}
      />
    </div>
  );
};

export default PackageAdd;
