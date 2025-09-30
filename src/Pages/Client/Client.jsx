// src/pages/clients.jsx
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";

const Clients = () => {
  const { data, loading, error } = useGet("/api/admin/clients");

  // ✅ الداتا الحقيقية للـ clients
const clients = data?.data || [];

console.log("Clients:", data?.data); // تحقق من هيكل البيانات

  const columns = [
    { key: "company_name", header: "Company Name", filterable: true },
    { key: "email", header: "Email", filterable: true },
    {
      key: "package_id",
      header: "Package",
      filterable: false,
      render: (value) => value?.name || "-", // ✅ نعرض اسم الباكدج
    },
    {
      key: "status",
      header: "Status",
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable
        data={clients}
        columns={columns}
        title="Clients Management"
        onAdd={() => alert("Add new client clicked!")}
        addButtonText="Add Client"
        addPath="add"
        itemsPerPage={10}
        searchable={true}
        filterable={true}
        showActions={false}
      />
    </div>
  );
};

export default Clients;
