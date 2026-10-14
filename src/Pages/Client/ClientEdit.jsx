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
          main_location: client.main_location || "",
          branches_locations: Array.isArray(client.branches_locations)
            ? client.branches_locations
            : [],
          payment_cycle: client.payment_cycle || "monthly",
          payment_amount: client.payment_amount || "",
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
    { key: "main_location", label: "Main Location" },
    {
      key: "branches_locations",
      label: "Branches Locations",
      type: "array",
      placeholder: "Enter branch address",
      addButtonText: "Add Branch",
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
    { key: "contact_person_name", label: "Contact Person Name" },
    { key: "contact_person_phone", label: "Contact Person Phone" },
    { key: "sales_man_name", label: "Sales Man Name" },
    { key: "sales_man_phone", label: "Sales Man Phone" },
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // ✅ نظف الفروع من الفراغات
      const payload = {
        ...data,
        branches_locations: (data.branches_locations || []).filter(
          (b) => b && b.trim() !== "",
        ),
      };

      // ✅ لو الباسورد فاضي، مش هنبعته أصلاً
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
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
    <div className="p-6">
      <AddPage
        title="Edit Client"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/client")}
        initialData={clientData}
        loading={isSubmitting}
      />
    </div>
  );
};

export default ClientEdit;
