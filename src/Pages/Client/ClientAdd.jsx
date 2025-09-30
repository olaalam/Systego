// src/pages/ClientAdd.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const ClientAdd = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  // ✅ هات الـ packageOptions من الـ API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/api/admin/clients");
        setPackages(res.data?.data?.packageOptions || []);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };
    fetchPackages();
  }, []);

  // ✅ نزود الـ options للـ field بتاع الباكدج
  const fields = [
    { key: "company_name", label: "Company Name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "password", label: "Password", type: "password", required: true },
    {
      key: "package_id",
      label: "Packages",
      type: "select", // ⬅️ لازم نخلي النوع select
      options: packages.map((p) => ({ value: p._id, label: p.name })),
      required: true,
    },
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
  ];

const handleSubmit = async (data) => {
  try {
    await api.post("/api/admin/clients/", data);
    toast.success("Client added successfully!");
    navigate("/client");
  } catch (err) {
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      "Failed to add client";

    // ✅ لو فيه تفاصيل إضافية (details array) نعرضها كلها
    if (err.response?.data?.error?.details) {
      err.response.data.error.details.forEach((d) => toast.error(d));
    } else {
      toast.error(message);
    }
  }
};


  return (
    <div className="p-6">
      <AddPage
        title="Add Client"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/client")}
        initialData={{ status: "active"}}
      />
    </div>
  );
};

export default ClientAdd;
