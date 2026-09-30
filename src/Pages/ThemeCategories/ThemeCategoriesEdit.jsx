import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";

export default function ThemeCategoriesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading: fetching } = useGet(`/api/admin/theme-categories/${id}`);
  const { putData, loading: updating } = usePut(`/api/admin/theme-categories/${id}`);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ar_name: "",
  });

  useEffect(() => {
    const category = data?.category || data?.data || data;
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        ar_name: category.ar_name || "",
      });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await putData(formData);
      navigate("/theme-categories");
    } catch (error) {
      console.error("Update category failed:", error);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Theme Category</h1>
      {updating && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Arabic Name</label>
          <input
            type="text"
            value={formData.ar_name}
            onChange={(e) => handleChange("ar_name", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate("/theme-categories")}
            className="px-6 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
