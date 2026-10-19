import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/DeleteForm";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";

const Extras = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useGet("/api/admin/extras/");
  const { deleteData, loading: deleting } = useDelete(
    "/api/admin/extras/delete",
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const extras = data?.data || [];

  const handleDelete = async (item) => {
    try {
      await deleteData(`/api/admin/extras/delete_item/${item._id}`);
      refetch();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      filterable: true,
      render: (value, row) => (
        <span
          className="text-purple-600 cursor-pointer hover:underline"
          onClick={() => navigate(`edit/${row._id}`)}
        >
          {value}
        </span>
      ),
    },
    { key: "ar_name", header: "Arabic Name", filterable: true },
    {
      key: "description",
      header: "Description",
      filterable: true,
      render: (value) => value || "-",
    },
    {
      key: "ar_description",
      header: "Arabic Description",
      filterable: true,
      render: (value) => value || "-",
    },
    {
      key: "is_recurring",
      header: "Type",
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value ? "Recurring" : "One time"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable
        data={extras}
        columns={columns}
        title="Extra Management"
        addButtonText="Add Extra"
        addPath="add"
        onAdd={() => navigate("/extras/add")}
        editPath={(item) => `edit/${item._id}`}
        onEdit={(item) => navigate(`edit/${item._id}`)}
        onDelete={(item) => setDeleteTarget(item)}
        itemsPerPage={10}
        searchable={true}
        filterable={true}
      />

      {deleteTarget && (
        <DeleteDialog
          title="Delete extra"
          message={`Are you sure you want to delete extra "${deleteTarget.name}"?`}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default Extras;
