// src/pages/packageEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";
import ExtrasSelector from "@/components/ExtrasSelector";

export default function PackageEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(
    `/api/admin/packages/update/${id}`,
  );

  const [packageData, setpackageData] = useState(null);
  const [fetching, setFetching] = useState(true);

  const { data: extrasData } = useGet("/api/admin/extras/");
  const extras = extrasData?.data || [];

  // ✅ Fetch the old package data on component mount
  useEffect(() => {
    const fetchpackage = async () => {
      try {
        const res = await api.get(`/api/admin/packages/${id}`);
        setpackageData(res.data?.data?.data);
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

  const packageFields = useMemo(
    () => [
      { key: "name", label: "Name", required: true },
      { key: "description", label: "Description", type: "text" },
      {
        key: "monthly_price",
        label: "Monthly Price",
        type: "number",
        required: true,
      },
      { key: "quarterly_price", label: "Quarterly Price", type: "number" },
      { key: "half_yearly_price", label: "Half-Yearly Price", type: "number" },
      { key: "yearly_price", label: "Yearly Price", type: "number" },
      { key: "haveEcommerce", label: "Ecommerce Support", type: "checkbox" },
      { key: "haveMobileApp", label: "Mobile App Support", type: "checkbox" },
      // ✅ الحقول الجديدة
      { key: "havePOS", label: "POS Support", type: "checkbox" },
      { key: "haveReports", label: "Reports Support", type: "checkbox" },
      { key: "haveStockTake", label: "Stock Take Support", type: "checkbox" },
      { key: "branches", label: "Allowed Branches", type: "number" },
      {
        key: "extras",
        label: "Extras (Add-ons)",
        type: "custom",
        render: (formData, setFormData) => (
          <ExtrasSelector
            options={extras}
            value={formData.extras || []}
            onChange={(ids) =>
              setFormData((prev) => ({ ...prev, extras: ids }))
            }
          />
        ),
      },
      { key: "status", label: "Active", type: "checkbox" },
    ],
    [extras],
  );

  if (fetching) {
    return <Loader />;
  }

  // Keep only the ids of the selected extras for the selector.
  const initialData = packageData
    ? {
        ...packageData,
        extras: Array.isArray(packageData.extras)
          ? packageData.extras.map((e) => e?._id || e)
          : [],
      }
    : {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {packageData && (
        <AddPage
          title={`Edit package: ${packageData?.code || packageData?.name || "..."}`}
          fields={packageFields}
          initialData={initialData} // Pass the fetched data
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      )}
    </div>
  );
}
