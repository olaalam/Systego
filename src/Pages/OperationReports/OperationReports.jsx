import React, { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import api from "@/api/api";
import { toast } from "react-toastify";
import OperationReportModal from "./OperationReportModal";

const OPERATION_STATUS_OPTIONS = ["Demo", "Sales", "Data", "Delivered"];

const OperationReports = () => {
  const { data, loading, refetch } = useGet("/api/admin/operation-reports");
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const list = data?.data?.data || data?.data || [];
    setReports(list);
  }, [data]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    // Optimistic update
    setReports((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );

    try {
      await api.patch(`/api/admin/operation-reports/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus === "active" ? "Active" : "Inactive"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      refetch();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOperationStatusChange = async (id, newOpStatus) => {
    setUpdatingId(id);
    // Optimistic update
    setReports((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, operation_status: newOpStatus } : r
      )
    );

    try {
      await api.patch(`/api/admin/operation-reports/${id}/status`, {
        operation_status: newOpStatus,
      });
      toast.success(`Operation status updated to ${newOpStatus}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update operation status"
      );
      refetch();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReportUpdated = (id, updatedFields) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r._id !== id) return r;
        let normalizedNotes = updatedFields.notes;
        if (updatedFields.notes !== undefined) {
          if (Array.isArray(updatedFields.notes)) {
            normalizedNotes = updatedFields.notes;
          } else if (Array.isArray(updatedFields.notes?.data)) {
            normalizedNotes = updatedFields.notes.data;
          } else {
            normalizedNotes = r.notes || [];
          }
        }
        return {
          ...r,
          ...updatedFields,
          ...(normalizedNotes !== undefined ? { notes: normalizedNotes } : {}),
        };
      })
    );
  };

  const columns = [
    {
      key: "company_name",
      header: "Company Name",
      render: (v, row) => (
        <button
          type="button"
          onClick={() => setSelectedReportId(row._id)}
          className="text-purple-600 hover:text-purple-800 font-semibold text-left hover:underline cursor-pointer transition-colors"
          title="Click to view details"
        >
          {v || "-"}
        </button>
      ),
    },
    {
      key: "package_id",
      header: "Package",
      render: (v, row) => {
        const pkg = row.package_id;
        if (!pkg) return <span className="text-gray-400 text-xs">-</span>;
        return (
          <div className="text-sm">
            <span className="font-medium text-gray-800">{pkg.name}</span>
            {pkg.price && (
              <span className="block text-xs text-gray-500">
                {Number(pkg.price).toLocaleString()} EGP
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (v, row) => (
        <select
          value={row.status || "active"}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          disabled={updatingId === row._id}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border cursor-pointer outline-none transition-all shadow-xs ${
            row.status === "active"
              ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
              : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
          }`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      ),
    },
    {
      key: "operation_status",
      header: "Operation Status",
      render: (v, row) => {
        const opStatus = row.operation_status || "Demo";
        const colorStyles = {
          Demo: "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100",
          Sales: "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100",
          Data: "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100",
          Delivered: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100",
          Delvierd: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100",
        };

        return (
          <select
            value={opStatus}
            onChange={(e) =>
              handleOperationStatusChange(row._id, e.target.value)
            }
            disabled={updatingId === row._id}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border cursor-pointer outline-none transition-all shadow-xs ${
              colorStyles[opStatus] || colorStyles.Demo
            }`}
          >
            {OPERATION_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      },
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
      render: (v, row) => {
        let list = [];
        if (Array.isArray(v)) list = v;
        else if (Array.isArray(row.notes)) list = row.notes;
        else if (Array.isArray(v?.data)) list = v.data;
        else if (Array.isArray(row.notes?.data)) list = row.notes.data;

        const count = list.length;
        return (
          <button
            type="button"
            onClick={() => setSelectedReportId(row._id)}
            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity ${
              count > 0
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"
            }`}
            title="Click to view/add notes"
          >
            {count} {count === 1 ? "note" : "notes"}
          </button>
        );
      },
    },
    {
      key: "subscription",
      header: "Subscription",
      render: (v, row) => {
        const sub = row.subscription;

        if (!sub || sub.daysLeft === null) {
          return <span className="text-gray-400">—</span>;
        }

        return (
          <div className="text-sm">
            {sub.expired ? (
              <div>
                <span className="text-red-600 font-medium">
                  Expired {Math.abs(sub.daysLeft)} days ago
                </span>
                {sub.isFirstCycle && (
                  <div className="text-xs text-gray-400 mt-1">
                    (from creation)
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="text-green-600 font-medium">
                  {sub.daysLeft} days left
                </span>
                {sub.isFirstCycle && (
                  <div className="text-xs text-gray-400 mt-1">
                    {sub.daysLeft} days left
                  </div>
                )}
              </div>
            )}
            {sub.endDate && (
              <div className="text-xs text-gray-500 mt-1">
                Until: {new Date(sub.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
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

      {/* Details & Notes Modal */}
      {selectedReportId && (
        <OperationReportModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onReportUpdated={handleReportUpdated}
        />
      )}
    </div>
  );
};

export default OperationReports;
