// src/pages/CouponAdd.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const CouponAdd = () => {
  const navigate = useNavigate();

  const fields = [
    { key: "code", label: "Coupon Code", required: true },
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
      await api.post("/api/admin/coupons/add", data);
      toast.success("Coupon added successfully!");
      navigate("/coupons"); // 👈 رجوع لصفحة الكوبونات
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add coupon");
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add Coupon"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/coupons")}
        initialData={{ status: true }}
      />
    </div>
  );
};

export default CouponAdd;
