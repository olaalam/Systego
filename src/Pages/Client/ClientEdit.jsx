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
  const [existingBranches, setExistingBranches] = useState([]);

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

        setExistingBranches(
          Array.isArray(client.existing_branches)
            ? client.existing_branches
            : [],
        );
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
      const payload = { ...data };

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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Branches
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
            {existingBranches.length}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          These are the branches that already exist in this client's admin.
          Branches are added and managed by the client; this list is read-only.
          The allowed number of branches is set on the client's package.
        </p>
        {existingBranches.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No branches found yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            {existingBranches.map((branch) => (
              <li
                key={branch._id}
                className="flex items-center justify-between px-4 py-2.5 bg-white"
              >
                <span className="text-sm text-gray-800">
                  {branch.name || branch.ar_name || "—"}
                </span>
                <span className="flex items-center gap-2">
                  {branch.enabled === false ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                      Suspended
                    </span>
                  ) : branch.Is_Online ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                      Online
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                      Offline
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

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
