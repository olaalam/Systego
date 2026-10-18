import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [regenerating, setRegenerating] = useState(false);

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
          Note: You can add multiple branches for this client.
        </p>
      </div>
    );
  };

  // ✅ جلب الباكدجات
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

  // ✅ جلب بيانات العميل
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get(`/api/admin/clients/${id}`);
        const client = res.data.data.data;

        setClientData({
          company_name: client.company_name || "",
          email: client.email || "",
          password: "", // ✅ فاضي دايماً عشان ميتغيرش
          package_id: client?.package_id?._id || "",
          logoBase64: client.logoBase64 || "",
          status: client.status || "active",
          operation_status: client.operation_status || "Demo",
          main_location: client.main_location || "",
          branches_config:
            Array.isArray(client.branches_config) &&
            client.branches_config.length > 0
              ? client.branches_config.map((b) => ({
                  name: b?.name || "",
                  Is_Online: !!b?.Is_Online,
                }))
              : [
                  ...(client.main_location
                    ? [{ name: client.main_location, Is_Online: true }]
                    : []),
                  ...(Array.isArray(client.branches_locations)
                    ? client.branches_locations.map((n) => ({
                        name: n,
                        Is_Online: false,
                      }))
                    : []),
                ],
          payment_cycle: client.payment_cycle || "monthly",
          payment_amount: client.payment_amount || "",
          subscription_end_date: client.subscription_end_date
            ? new Date(client.subscription_end_date).toISOString().slice(0, 10)
            : client.subscription?.endDate
              ? new Date(client.subscription.endDate).toISOString().slice(0, 10)
              : "",
          contact_person_name: client.contact_person_name || "",
          contact_person_phone: client.contact_person_phone || "",
          sales_man_name: client.sales_man_name || "",
          sales_man_phone: client.sales_man_phone || "",
        });
      } catch (err) {
        toast.error("Failed to fetch client data");
        console.error("❌ Error fetching client:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchClient();
  }, [id]);

  const fields = [
    { key: "company_name", label: "Company Name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    {
      key: "password",
      label: "Password (leave empty to keep current)",
      type: "password",
      required: false, // ✅ مش إجباري
    },
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
      label: "Active until",
      type: "date",
    },
    { key: "contact_person_name", label: "Contact Person Name" },
    { key: "contact_person_phone", label: "Contact Person Phone" },
    { key: "sales_man_name", label: "Sales Man Name" },
    { key: "sales_man_phone", label: "Sales Man Phone" },
  ];

  const handleRegenerateApiKey = async () => {
    setRegenerating(true);
    try {
      const res = await api.post(`/api/admin/clients/${id}/regenerate-api-key`);
      const key = res?.data?.data?.apiKey || res?.data?.data?.data?.apiKey;
      if (key) {
        setApiKey(key);
        toast.success(
          "API key regenerated. Copy it now — it won't be shown again.",
        );
      } else {
        toast.error("No API key returned");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to regenerate API key",
      );
    } finally {
      setRegenerating(false);
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // ✅ نظف الفروع وحدّد الأونلاين
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

      // ✅ لو الباسورد فاضي، مش هنبعته أصلاً
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }

      if (!payload.subscription_end_date) {
        delete payload.subscription_end_date;
      }

      await api.put(`/api/admin/clients/${id}`, payload);

      toast.success("Client updated successfully!");
      navigate("/client");
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to update client";

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
    <div className="p-6 space-y-6">
      <AddPage
        title="Edit Client"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/client")}
        initialData={clientData}
        loading={isSubmitting}
      />

      <div className="bg-white rounded-xl shadow p-5 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Tenant API Key</h3>
        <p className="text-sm text-gray-500">
          Used by the client backend to verify its subscription. Regenerate if
          the client shows wrong tenant data. The key is shown only once.
        </p>
        <button
          type="button"
          disabled={regenerating}
          onClick={handleRegenerateApiKey}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Regenerate API Key"}
        </button>
        {apiKey && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 break-all font-mono text-xs text-gray-800">
            {apiKey}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEdit;
