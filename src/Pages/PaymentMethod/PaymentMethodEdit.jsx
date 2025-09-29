// src/pages/payment-methodEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";

export default function PaymentMethodEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(`/api/admin/payment-methods/update/${id}`);

  const [paymentMethodData, setpaymentMethodData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch the old payment-method data on component mount
  useEffect(() => {
    const fetchpaymentMethod = async () => {
      try {
        const res = await api.get(`/api/admin/payment-methods/${id}`);
        setpaymentMethodData(res.data);
      } catch (err) {
        toast.error("Failed to fetch payment-method data");
        console.error("❌ Error fetching payment-method:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchpaymentMethod();
  }, [id]);

  // ✅ Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("payment-method updated successfully!");
      navigate("/payment-methods");
    } catch (err) {
      toast.error("Failed to update payment-method", err);
    }
  };

  const handleCancel = () => navigate("/payment-methods");

  if (fetching) {
    return (
      <Loader />
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {paymentMethodData && (
        <AddPage
        title={`Edit payment-method: ${paymentMethodData?.code || "..."}`}
          initialData={paymentMethodData} // Pass the fetched data
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}