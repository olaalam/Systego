import React from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import { Eye } from "lucide-react";

const OperationReports = () => {
  const { data, loading } = useGet("/api/admin/operation-reports");
  const navigate = useNavigate();
  const reports = data?.data?.data || data?.data || [];

  const columns = [
    { key: "company_name", header: "Company Name" },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            v === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {v === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "main_location", header: "Main Location", render: (v) => v || "-" },
    {
      key: "branches_locations",
      header: "Branches",
      render: (v) =>
        v && v.length > 0 ? (
          <span className="text-sm text-gray-700">
            {v.length} branch{v.length > 1 ? "es" : ""}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "payment_cycle",
      header: "Payment",
      render: (v, row) => {
        const cycleLabels = {
          monthly: "Monthly",
          quarterly: "Quarterly",
          half_yearly: "Half Yearly",
          yearly: "Yearly",
        };
        if (!v && !row.payment_amount) return "-";
        return (
          <span className="text-sm">
            {cycleLabels[v] || v || "-"}
            {row.payment_amount
              ? ` - ${row.payment_amount.toLocaleString()} EGP`
              : ""}
          </span>
        );
      },
    },
    {
      key: "contact_person_name",
      header: "Contact Person",
      render: (v, row) => (
        <div className="text-sm">
          <div>{v || "-"}</div>
          {row.contact_person_phone && (
            <div className="text-gray-500 text-xs">
              {row.contact_person_phone}
            </div>
          )}
        </div>
      ),
    },
    { key: "sales_man_name", header: "Sales Man", render: (v) => v || "-" },
    {
      key: "notes",
      header: "Notes",
      render: (v) => {
        const count = v?.length || 0;
        return (
          <span
            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              count > 0
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {count} {count === 1 ? "note" : "notes"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <button
          onClick={() => navigate(`/operation-reports/view/${row._id}`)}
          className="text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable
        data={reports}
        columns={columns}
        title="Operation Reports"
        itemsPerPage={10}
        searchable={true}
        filterable={true}
      />
    </div>
  );
};

export default OperationReports;
