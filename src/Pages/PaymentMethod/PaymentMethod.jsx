// src/pages/payment-methods.jsx
import { useState } from "react";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/DeleteForm";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";

const PaymentMethods = () => {
  const { data, loading, error, refetch } = useGet("/api/admin/payment-methods");
  const { deleteData, loading: deleting } = useDelete(
    "/api/admin/payment-methods/delete"
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const PaymentMethod = data?.data || [];

  const handleDelete = async (item) => {
    try {
      // ✅ استدعاء الـ API مع id
      await deleteData(`/api/admin/payment-methods/${item._id}`);
      refetch();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: "name", header: "Name", filterable: true },
    { key: "description", header: "Description", filterable: true },
    { key: "logo", header: "Logo", filterable: false },
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
        data={PaymentMethod}
        columns={columns}
        title="payment-method Management"
        onAdd={() => alert("Add new payment-method clicked!")}
        onEdit={(item) => alert(`Edit payment-method: ${item.code}`)}
        onDelete={(item) => setDeleteTarget(item)} // 👈 فتح الديالوغ
        addButtonText="Add payment-method"
        addPath="add"
        editPath={(item) => `edit/${item._id}`}
        itemsPerPage={10}
        searchable={true}
        filterable={true}
      />

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          title="Delete payment-method"
          message={`Are you sure you want to delete payment-method "${
            deleteTarget.code || deleteTarget.name
          }"?`}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default PaymentMethods;
