import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import {
  X,
  Trash2,
  Send,
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  CreditCard,
  Package,
  Puzzle,
  GitBranch,
} from "lucide-react";
import SubscriptionActions from "@/components/SubscriptionActions";

const OPERATION_STATUS_OPTIONS = ["Demo", "Sales", "Data", "View", "Delivered"];

const OperationReportModal = ({ reportId, onClose, onReportUpdated }) => {
  const [report, setReport] = useState(null);
  const [fetching, setFetching] = useState(true);
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const isViewer = admin.role === "viewer";
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingField, setUpdatingField] = useState(false);

  const existingBranches = Array.isArray(report?.existing_branches)
    ? report.existing_branches
    : [];

  const extras = Array.isArray(report?.package_id?.extras)
    ? report.package_id.extras
    : [];

  const fetchReport = async () => {
    try {
      const res = await api.get(`/api/admin/operation-reports/${reportId}`);
      let data = res.data?.data?.data || res.data?.data;
      if (data) {
        let notesArr = [];
        if (Array.isArray(data.notes)) notesArr = data.notes;
        else if (Array.isArray(data.notes?.data)) notesArr = data.notes.data;
        data = { ...data, notes: notesArr };
      }
      setReport(data);
    } catch (err) {
      toast.error("Failed to fetch report details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      setFetching(true);
      fetchReport();
    }
  }, [reportId]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingField(true);
      await api.patch(`/api/admin/operation-reports/${reportId}/status`, {
        status: newStatus,
      });
      setReport((prev) => ({ ...prev, status: newStatus }));
      if (onReportUpdated) {
        onReportUpdated(reportId, { status: newStatus });
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingField(false);
    }
  };

  const handleOperationStatusChange = async (newOpStatus) => {
    try {
      setUpdatingField(true);
      await api.patch(`/api/admin/operation-reports/${reportId}/status`, {
        operation_status: newOpStatus,
      });
      setReport((prev) => ({ ...prev, operation_status: newOpStatus }));
      if (onReportUpdated) {
        onReportUpdated(reportId, { operation_status: newOpStatus });
      }
      toast.success(`Operation status updated to ${newOpStatus}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update operation status",
      );
    } finally {
      setUpdatingField(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const noteText = newNote.trim();
    setAddingNote(true);
    try {
      const res = await api.post(
        `/api/admin/operation-reports/${reportId}/notes`,
        { text: noteText },
      );
      toast.success("Note added!");
      setNewNote("");

      // Backend returns { success: true, data: { message: "...", data: client.notes } }
      let updatedNotes = [];
      const payload = res.data?.data;
      if (Array.isArray(payload?.data)) {
        updatedNotes = payload.data;
      } else if (Array.isArray(payload)) {
        updatedNotes = payload;
      } else if (Array.isArray(res.data?.data?.notes)) {
        updatedNotes = res.data.data.notes;
      } else {
        const prevNotes = Array.isArray(report?.notes) ? report.notes : [];
        updatedNotes = [
          ...prevNotes,
          { text: noteText, created_at: new Date() },
        ];
      }

      setReport((prev) => ({ ...prev, notes: updatedNotes }));
      if (onReportUpdated) {
        onReportUpdated(reportId, { notes: updatedNotes });
      }
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (index) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await api.delete(
        `/api/admin/operation-reports/${reportId}/notes/${index}`,
      );
      toast.success("Note deleted");

      let updatedNotes = [];
      const payload = res.data?.data;
      if (Array.isArray(payload?.data)) {
        updatedNotes = payload.data;
      } else if (Array.isArray(payload)) {
        updatedNotes = payload;
      } else {
        const prevNotes = Array.isArray(report?.notes) ? report.notes : [];
        updatedNotes = prevNotes.filter((_, i) => i !== index);
      }

      setReport((prev) => ({ ...prev, notes: updatedNotes }));
      if (onReportUpdated) {
        onReportUpdated(reportId, { notes: updatedNotes });
      }
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {report?.company_name || "Company Details"}
              </h2>
              <span className="text-xs text-gray-500">Operation Report</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {fetching ? (
            <div className="py-16">
              <Loader />
            </div>
          ) : !report ? (
            <div className="text-center py-12 text-gray-500">
              Report not found
            </div>
          ) : (
            <>
              {/* Logo & Quick Status Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50/40 rounded-xl border border-gray-100">
                {report.logoBase64 && (
                  <img
                    src={
                      report.logoBase64.startsWith("data:")
                        ? report.logoBase64
                        : `data:image/png;base64,${report.logoBase64}`
                    }
                    alt={`${report.company_name} logo`}
                    className="w-20 h-20 object-contain rounded-xl border bg-white p-1.5 shadow-sm"
                  />
                )}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Status toggle/select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        Status:
                      </span>
                      <select
                        value={report.status || "active"}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updatingField}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all shadow-sm ${
                          report.status === "active"
                            ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                            : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Operation Status select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        Operation Status:
                      </span>
                      <select
                        value={report.operation_status || "Demo"}
                        onChange={(e) =>
                          handleOperationStatusChange(e.target.value)
                        }
                        disabled={updatingField}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer outline-none transition-all shadow-sm"
                      >
                        {OPERATION_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Package size={16} className="text-violet-500" />
                    <span>Package</span>
                  </div>
                  {report.package_id ? (
                    <>
                      <p className="text-sm font-semibold text-gray-800 break-words">
                        {report.package_id.name}
                        {report.package_id.price
                          ? ` — ${Number(
                              report.package_id.price,
                            ).toLocaleString()} EGP`
                          : ""}
                      </p>

                      {extras.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {extras.map((extra, index) => (
                            <span
                              key={extra._id || index}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100"
                              title={extra.description || ""}
                            >
                              <Puzzle size={11} />
                              {extra.name || extra.ar_name || "extra"}
                              <span className="text-violet-400">
                                ·{" "}
                                {extra.is_recurring ? "recurring" : "one-time"}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-gray-800">-</p>
                  )}
                </div>
                <DetailCard
                  icon={<GitBranch size={16} className="text-violet-500" />}
                  label="Branches Allowed"
                  value={
                    !report.package_id
                      ? "-"
                      : typeof report.package_id.branches !== "number"
                        ? "—"
                        : report.package_id.branches > 0
                          ? String(report.package_id.branches)
                          : "Unlimited"
                  }
                />
                <DetailCard
                  icon={<Mail size={16} className="text-blue-500" />}
                  label="Email"
                  value={report.email}
                />
                <DetailCard
                  icon={<MapPin size={16} className="text-red-500" />}
                  label="Main Location"
                  value={report.main_location}
                />
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/60 rounded-xl md:col-span-2">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <GitBranch size={16} className="text-orange-500" />
                      <span>Branches</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                      {existingBranches.length}{" "}
                      {existingBranches.length === 1 ? "branch" : "branches"}
                    </span>
                  </div>

                  {existingBranches.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">
                      No branches recorded yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {existingBranches.map((branch, index) => (
                        <BranchChip key={branch._id || index} branch={branch} />
                      ))}
                    </div>
                  )}
                </div>
                <DetailCard
                  icon={<CreditCard size={16} className="text-emerald-500" />}
                  label="Payment Cycle & Amount"
                  value={
                    report.payment_cycle
                      ? `${report.payment_cycle} ${
                          report.payment_amount
                            ? `(${report.payment_amount.toLocaleString()} EGP)`
                            : ""
                        }`
                      : "-"
                  }
                />
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/60 rounded-xl md:col-span-2">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs text-gray-500">Subscription</span>
                    {!isViewer && (
                      <SubscriptionActions
                        clientId={reportId}
                        client={report}
                        onUpdated={(updated) => {
                          setReport((prev) => ({ ...prev, ...updated }));
                          if (onReportUpdated) {
                            onReportUpdated(reportId, updated);
                          }
                        }}
                      />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {report.subscription?.expired
                      ? "Expired"
                      : report.subscription?.daysLeft != null
                        ? `${report.subscription.daysLeft} days left`
                        : report.status === "active"
                          ? "Active"
                          : "Inactive"}
                  </p>
                  {(report.subscription_end_date ||
                    report.subscription?.endDate) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Until{" "}
                      {new Date(
                        report.subscription_end_date ||
                          report.subscription.endDate,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <DetailCard
                  icon={<User size={16} className="text-purple-500" />}
                  label="Contact Person"
                  value={report.contact_person_name}
                  subValue={report.contact_person_phone}
                />
                <DetailCard
                  icon={<User size={16} className="text-indigo-500" />}
                  label="Sales Representative"
                  value={report.sales_man_name}
                  subValue={report.sales_man_phone}
                />
              </div>

              {/* Notes Section */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center justify-between">
                  <span>Notes</span>
                  <span className="text-xs font-normal text-gray-500">
                    {report.notes?.length || 0} total
                  </span>
                </h3>

                {/* Add Note Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a new note..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !newNote.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Send size={16} /> Add
                  </button>
                </div>

                {/* Notes List */}
                {Array.isArray(report.notes) && report.notes.length > 0 ? (
                  <ul className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {report.notes.map((note, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 hover:bg-gray-100/70 border border-gray-200/70 rounded-xl p-3 flex justify-between items-start transition-colors"
                      >
                        <div className="pr-4">
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">
                            {note.text}
                          </p>
                          <span className="text-[11px] text-gray-400 mt-1 inline-block">
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(index)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center py-6 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No notes recorded yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BranchChip = ({ branch }) => {
  const suspended = branch.enabled === false;
  const online = !!branch.Is_Online;

  const dot = suspended
    ? "bg-red-500"
    : online
      ? "bg-green-500"
      : "bg-gray-400";

  const label = suspended ? "Suspended" : online ? "Online" : "Offline";

  const labelStyle = suspended
    ? "text-red-600 bg-red-50"
    : online
      ? "text-green-700 bg-green-50"
      : "text-gray-500 bg-gray-100";

  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="text-sm text-gray-800">
        {branch.name || branch.ar_name || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${labelStyle}`}
      >
        {label}
      </span>
    </span>
  );
};

const DetailCard = ({ icon, label, value, subValue }) => (
  <div className="p-3.5 bg-gray-50/70 border border-gray-200/60 rounded-xl">
    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-800 break-words">
      {value || "-"}
    </p>
    {subValue && (
      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
        <Phone size={12} /> {subValue}
      </p>
    )}
  </div>
);

export default OperationReportModal;
