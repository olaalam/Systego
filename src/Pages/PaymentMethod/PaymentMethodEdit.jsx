// src/pages/PaymentMethodEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";

export default function PaymentMethodEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(
    `/api/admin/payment-methods/${id}`
  );

  const [paymentMethodData, setPaymentMethodData] = useState(null);
  const [fetching, setFetching] = useState(true);

  const fields = useMemo(() => [
    { key: "name", label: "Name", required: true },
    { key: "description", label: "Description", required: true },
    { key: "logo", label: "Logo", type: "image", required: true },
    { key: "status", label: "Active", type: "checkbox" },
  ], []);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const res = await api.get(`/api/admin/payment-methods/${id}`);
        
        console.log("🔍 Full API Response:", res.data);
        
        // ✅ حاول كل الاحتمالات للوصول للبيانات
        const paymentMethod = res.data.data?.data || res.data.data || res.data;
        
        console.log("🎯 Extracted payment method:", paymentMethod);
        
        setPaymentMethodData({
          name: paymentMethod.name || "",
          description: paymentMethod.description || "",
          logo: paymentMethod.logo || "",
          status: paymentMethod.status || false,
        });
      } catch (err) {
        toast.error("Failed to fetch payment method data");
        console.error("❌ Error fetching payment method:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchPaymentMethod();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("Payment method updated successfully!");
      navigate("/payment-method");
    } catch (err) {
      // ✅ عرض الأخطاء من الـ API
      const errorMessage = 
        err.response?.data?.error?.message || 
        err.response?.data?.message || 
        "Failed to update payment method";
      
      const errorDetails = err.response?.data?.error?.details;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        errorDetails.forEach(detail => toast.error(detail));
      } else {
        toast.error(errorMessage);
      }
      
      console.error("❌ Error:", err.response?.data);
    }
  };

  const handleCancel = () => navigate("/payment-method");

  if (fetching) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {paymentMethodData && (
        <AddPage
          title={`Edit Payment Method: ${paymentMethodData?.name || "..."}`}
          description="Update payment method details and logo"
          fields={fields}
          initialData={paymentMethodData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}