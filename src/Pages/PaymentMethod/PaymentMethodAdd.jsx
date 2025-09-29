// src/pages/payment-methodAdd.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const PaymentMethodAdd = () => {
  const navigate = useNavigate();

  const fields = [
    { key: "code", label: "payment-method Code", required: true },
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
      await api.post("/api/admin/payment-methods/add", data);
      toast.success("payment-method added successfully!");
      navigate("/payment-methods"); // 👈 رجوع لصفحة الكوبونات
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add payment-method");
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add payment-method"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/payment-methods")}
        initialData={{ status: true }}
      />
    </div>
  );
};

export default PaymentMethodAdd;
