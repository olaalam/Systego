import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import AddPage from "@/components/AddPage";

export default function ExtraEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { putData, loading: updating } = usePut(
    `/api/admin/extras/update/${id}`,
  );

  const [extraData, setExtraData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const res = await api.get(`/api/admin/extras/${id}`);
        setExtraData(res.data?.data?.data);
      } catch (err) {
        toast.error("Failed to fetch extra data");
        console.error("❌ Error fetching extra:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchExtra();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await putData(formData);
      toast.success("Extra updated successfully!");
      navigate("/extras");
    } catch (err) {
      toast.error("Failed to update extra", err);
    }
  };

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

  if (fetching) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {extraData && (
        <AddPage
          title={`Edit Extra: ${extraData?.name || ""}`}
          fields={fields}
          initialData={extraData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/extras")}
          loading={updating}
        />
      )}
    </div>
  );
}
