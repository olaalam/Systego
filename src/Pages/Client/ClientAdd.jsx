import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const ClientAdd = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Branch editor: name + which branches are online (owner decides how many).
  const renderBranches = (formData, setFormData) => {
    const list = Array.isArray(formData.branches_config)
      ? formData.branches_config
      : [];

    const updateItem = (index, patch) =>
      setFormData((prev) => ({
        ...prev,
        branches_config: (prev.branches_config || []).map((it, i) =>
          i === index ? { ...it, ...patch } : it,
        ),
      }));

    const addItem = () =>
      setFormData((prev) => ({
        ...prev,
        branches_config: [
          ...(prev.branches_config || []),
          { name: "", Is_Online: false },
        ],
      }));

    const removeItem = (index) =>
      setFormData((prev) => ({
        ...prev,
        branches_config: (prev.branches_config || []).filter(
          (_, i) => i !== index,
        ),
      }));

    return (
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={item.name || ""}
              onChange={(e) => updateItem(index, { name: e.target.value })}
              placeholder="Enter branch name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <label className="flex items-center gap-1.5 text-sm text-gray-700 whitespace-nowrap">
              <input
                type="checkbox"
                checked={!!item.Is_Online}
                onChange={(e) =>
                  updateItem(index, { Is_Online: e.target.checked })
                }
                className="h-4 w-4"
              />
              Online
            </label>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          + Add Branch
        </button>
        <p className="text-xs text-gray-500">
          حدّد علامة Online على الفروع اللي عايزها أونلاين (تقدر تختار أكتر من فرع).
        </p>
      </div>
    );
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/api/admin/clients/selectionPackages");
        setPackages(res?.data?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
        toast.error("Failed to load packages");
      }
    };
    fetchPackages();
  }, []);

  const fields = [
    { key: "company_name", label: "Company Name", required: true },
    { key: "subdomain", label: "Sub Domain", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "password", label: "Password", type: "password", required: true },
    {
      key: "package_id",
      label: "Packages",
      type: "select",
      options: packages.map((p) => ({ value: p._id, label: p.name })),
      required: true,
    },
    { key: "logoBase64", label: "Logo", type: "image", required: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      required: true,
    },
    {
      key: "operation_status",
      label: "Operation Status",
      type: "select",
      options: [
        { value: "Demo", label: "Demo" },
        { value: "Sales", label: "Sales" },
        { value: "Data", label: "Data" },
        { value: "Delivered", label: "Delivered" },
      ],
    },
    // ✅ الحقول الجديدة
    { key: "main_location", label: "Main Location (Main Branch)" },
    {
      key: "branches_config",
      label: "Branches",
      type: "custom",
      render: renderBranches,
    },
    {
      key: "payment_cycle",
      label: "Payment Cycle",
      type: "select",
      options: [
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "half_yearly", label: "Half Yearly" },
        { value: "yearly", label: "Yearly" },
      ],
    },
    { key: "payment_amount", label: "Payment Amount", type: "number" },
    {
      key: "subscription_end_date",
      label: "Active until (optional — defaults to one payment cycle)",
      type: "date",
    },
    { key: "contact_person_name", label: "Contact Person Name" },
    { key: "contact_person_phone", label: "Contact Person Phone" },
    { key: "sales_man_name", label: "Sales Man Name" },
    { key: "sales_man_phone", label: "Sales Man Phone" },
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // ✅ الفروع: قائمة مرتبة (اسم + أونلاين)
      const branches = (data.branches_config || [])
        .map((b) => ({
          name: (b?.name || "").trim(),
          Is_Online: !!b?.Is_Online,
        }))
        .filter((b) => b.name !== "");

      const payload = {
        ...data,
        branches_config: branches,
        branches_locations: branches.map((b) => b.name),
      };

      if (!payload.subscription_end_date) {
        delete payload.subscription_end_date;
      }

      const res = await api.post("/api/admin/clients/", payload);
      const newClient = res.data;

      if (newClient && newClient._id) {
        sessionStorage.setItem("client_id", newClient._id);
        sessionStorage.setItem("client_name", newClient.company_name);
      }

      toast.success("Client added successfully!");
      navigate("/client");
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to add client";

      if (err.response?.data?.error?.details) {
        err.response.data.error.details.forEach((d) => toast.error(d));
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <AddPage
        title="Add Client"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/client")}
        initialData={{ status: "active", operation_status: "Demo", payment_cycle: "monthly" }}
        loading={isSubmitting}
      />
    </div>
  );
};

export default ClientAdd;
