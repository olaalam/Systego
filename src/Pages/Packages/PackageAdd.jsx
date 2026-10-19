// src/pages/packageAdd.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import ExtrasSelector from "@/components/ExtrasSelector";
import useGet from "@/hooks/useGet";
import api from "@/api/api";
import { toast } from "react-toastify";

const PackageAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: extrasData } = useGet("/api/admin/extras/");
  const extras = extrasData?.data || [];

  const fields = useMemo(
    () => [
      { key: "name", label: "package Name", required: true },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "monthly_price",
        label: "monthly_price",
        type: "number",
        required: true,
      },
      {
        key: "quarterly_price",
        label: "quarterly_price",
        type: "number",
        required: true,
      },
      {
        key: "yearly_price",
        label: "yearly_price",
        type: "number",
        required: true,
      },
      {
        key: "half_yearly_price",
        label: "half_yearly_price",
        type: "number",
        required: true,
      },
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

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/admin/packages/add", data);
      toast.success("package added successfully!");
      navigate("/packages"); // 👈 رجوع لصفحة الباكدجات
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add package"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/packages")}
        initialData={{ status: true, extras: [] }}
        loading={isSubmitting}
      />
    </div>
  );
};

export default PackageAdd;
