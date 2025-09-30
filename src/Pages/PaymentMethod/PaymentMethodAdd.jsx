// src/pages/payment-methodAdd.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const PaymentMethodAdd = () => {
  const navigate = useNavigate();

  const fields = [
    { key: "name", label: "Name", required: true },
    { key: "description", label: "Description", required: true },
    { key: "logo", label: "Logo", type: "image", required: true }, // ✅ غيرنا النوع لـ image
    { key: "status", label: "Active", type: "checkbox" },
  ];

  const handleSubmit = async (data) => {
    try {
      await api.post("/api/admin/payment-methods/", data);
      toast.success("Payment method added successfully!");
      navigate("/payment-methods");
    } catch (err) {
      // ✅ عرض الأخطاء من الـ API
      const errorMessage = 
        err.response?.data?.error?.message || 
        err.response?.data?.message || 
        "Failed to add payment method";
      
      const errorDetails = err.response?.data?.error?.details;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        errorDetails.forEach(detail => toast.error(detail));
      } else {
        toast.error(errorMessage);
      }
      
      console.error("❌ Error:", err.response?.data);
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add Payment Method"
        description="Upload logo and fill in the details"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/payment-method")}
        initialData={{ status: true }}
      />
    </div>
  );
};

export default PaymentMethodAdd;