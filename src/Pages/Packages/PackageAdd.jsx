// src/pages/packageAdd.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const PackageAdd = () => {
  const navigate = useNavigate();

  const fields = [
    { key: "code", label: "package Code", required: true },
    {
      key: "discount_type",
      label: "Discount Type",
      type: "select",
      options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed Amount" },
      ],
      required: true,
    },
    { key: "discount", label: "Discount", type: "number", required: true },
    { key: "from", label: "Valid From", type: "date", required: true },
    { key: "to", label: "Valid To", type: "date", required: true },
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
