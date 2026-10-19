import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import api from "@/api/api";
import { toast } from "react-toastify";

const ExtraAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    { key: "name", label: "Name (English)", required: true },
    { key: "ar_name", label: "Name (Arabic)" },
    { key: "description", label: "Description (English)", type: "text" },
    { key: "ar_description", label: "Description (Arabic)", type: "text" },
    {
      key: "is_recurring",
      label: "Recurring (repeats every cycle)",
      type: "checkbox",
    },
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/admin/extras/add", data);
      toast.success("Extra added successfully!");
      navigate("/extras");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to add extra",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AddPage
        title="Add Extra"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/extras")}
        initialData={{ is_recurring: false }}
        loading={isSubmitting}
      />
    </div>
  );
};

export default ExtraAdd;
