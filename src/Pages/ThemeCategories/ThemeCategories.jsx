import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteForm";
import Loader from "@/components/Loader";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";

const normalizeList = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  return [];
};

export default function ThemeCategoriesPage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useGet("/api/admin/theme-categories");
  const { deleteData, loading: deleting } = useDelete();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = normalizeList(data, "categories");

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await deleteData(`/api/admin/theme-categories/${deleteTarget._id}`);
      refetch();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: "name", header: "Name", filterable: true },
    { key: "description", header: "Description", filterable: true },
    { key: "ar_name", header: "Arabic Name", filterable: true },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable
        data={categories}
        columns={columns}
        title="Theme Categories"
        onAdd={() => navigate("/theme-categories/add")}
        onDelete={(item) => setDeleteTarget(item)}
        onEdit={(item) => navigate(`/theme-categories/edit/${item._id}`)}
        addButtonText="Add Category"
        editPath={(item) => `/theme-categories/edit/${item._id}`}
        itemsPerPage={10}
        searchable
        filterable
      />

      {deleteTarget && (
        <DeleteDialog
          title="Delete Category"
          message={`Are you sure you want to delete category "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {deleting && <div className="hidden" />}
    </div>
  );
}
