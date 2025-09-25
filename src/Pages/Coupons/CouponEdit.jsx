// src/pages/CouponEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPackage from "@/components/AddPage"; // Use the correct component name
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function CouponEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(`/api/admin/coupons/update/${id}`);

  const [couponData, setCouponData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch the old coupon data on component mount
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await api.get(`/api/admin/coupons/${id}`);
        setCouponData(res.data);
      } catch (err) {
        toast.error("Failed to fetch coupon data");
        console.error("❌ Error fetching coupon:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchCoupon();
  }, [id]);

  // ✅ Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("Coupon updated successfully!");
      navigate("/coupons");
    } catch (err) {
      toast.error("Failed to update coupon",err);
    }
  };

  const handleCancel = () => navigate("/coupons");

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {couponData && (
        <AddPackage
          title={`Edit Coupon #${id}`}
          initialData={couponData} // Pass the fetched data
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}