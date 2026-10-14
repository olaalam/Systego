import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const ClientAdd = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // ✅ الحقول الجديدة
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
      // ✅ الفروع Array جاهزة
      const payload = {
        ...data,
        branches_locations: (data.branches_locations || []).filter(
          (b) => b && b.trim() !== "",
        ),
      };

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
        initialData={{ status: "active", payment_cycle: "monthly" }}
        loading={isSubmitting}
      />
    </div>
  );
};

export default ClientAdd;
