// src/pages/Coupons.jsx
import { useState } from "react";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/DeleteForm";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";

const Coupons = () => {
  const { data, loading, error, refetch } = useGet("/api/admin/coupons");
  const { deleteData, loading: deleting } = useDelete(
    "/api/admin/coupons/delete"
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const coupons = data?.data || [];

  const handleDelete = async (item) => {
    try {
      // ✅ استدعاء الـ API مع id
      await deleteData(`/api/admin/coupons/delete_item/${item._id}`);
      refetch();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: "code", header: "Code", filterable: true },
    { key: "discount_type", header: "Type", filterable: true },
    { key: "discount", header: "Discount", filterable: false },
    {
      key: "from",
      header: "From",
      filterable: false,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "to",
      header: "To",
      filterable: false,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable
        data={coupons}
        columns={columns}
        title="Coupon Management"
        onAdd={() => alert("Add new coupon clicked!")}
        onEdit={(item) => alert(`Edit coupon: ${item.code}`)}
        onDelete={(item) => setDeleteTarget(item)} // 👈 فتح الديالوغ
        addButtonText="Add Coupon"
        addPath="add"
        editPath={(item) => `edit/${item._id}`}
        itemsPerPage={10}
        searchable={true}
        filterable={true}
      />

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          title="Delete Coupon"
          message={`Are you sure you want to delete coupon "${
            deleteTarget.code || deleteTarget._id
          }"?`}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default Coupons;
