// src/pages/packageEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";

export default function PackageEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(`/api/admin/packages/update/${id}`);

  const [packageData, setpackageData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch the old package data on component mount
  useEffect(() => {
    const fetchpackage = async () => {
      try {
        const res = await api.get(`/api/admin/packages/${id}`);
        setpackageData(res.data?.data?.data);
        console.log("Fetched package data:", res.data.data.data);
        
      } catch (err) {
        toast.error("Failed to fetch package data");
        console.error("❌ Error fetching package:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchpackage();
  }, [id]);

  // ✅ Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("package updated successfully!");
      navigate("/packages");
    } catch (err) {
      toast.error("Failed to update package", err);
    }
  };

  const handleCancel = () => navigate("/packages");

  if (fetching) {
    return (
      <Loader />
    );
  }
const packageFields = [
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description", type: "text" },
  { key: "monthly_price", label: "Monthly Price", type: "number", required: true },
  { key: "quarterly_price", label: "Quarterly Price", type: "number" },
  { key: "half_yearly_price", label: "Half-Yearly Price", type: "number" },
  { key: "yearly_price", label: "Yearly Price", type: "number" },
  { key: "status", label: "Active", type: "checkbox" },
];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {packageData && (
        <AddPage
        title={`Edit package: ${packageData?.code || "..."}`}
          fields={packageFields}
          initialData={packageData} // Pass the fetched data
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}