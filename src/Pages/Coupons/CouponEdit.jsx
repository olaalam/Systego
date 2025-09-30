// src/pages/CouponEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";

export default function CouponEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(
    `/api/admin/coupons/update/${id}`
  );

  const [couponData, setCouponData] = useState(null);
  const [fetching, setFetching] = useState(true);

  const fields = useMemo(() => [
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
  ], []);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await api.get(`/api/admin/coupons/${id}`);
        
        console.log("🔍 Full API Response:", res.data.data.data);
        
        const coupon =  res.data.data.data;
        
        console.log("🎯 Extracted coupon:", coupon);
        
        setCouponData({
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount: coupon.discount,
          from: coupon.from ? coupon.from.split("T")[0] : "",
          to: coupon.to ? coupon.to.split("T")[0] : "",
          status: coupon.status || false,
        });
      } catch (err) {
        toast.error("Failed to fetch coupon data");
        console.error("❌ Error fetching coupon:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("Coupon updated successfully!");
      navigate("/coupons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
    }
  };

  const handleCancel = () => navigate("/coupons");

  if (fetching) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {couponData && (
        <AddPage
          title={`Edit Coupon: ${couponData?.code || "..."}`}
          fields={fields}
          initialData={couponData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}