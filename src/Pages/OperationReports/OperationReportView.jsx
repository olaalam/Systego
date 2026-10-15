import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/api";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { ArrowLeft, Trash2, Send } from "lucide-react";

const OperationReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/api/admin/operation-reports/${id}`);
      setReport(res.data.data.data);
    } catch (err) {
      toast.error("Failed to fetch report");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      await api.post(`/api/admin/operation-reports/${id}/notes`, {
        text: newNote,
      });
      toast.success("Note added!");
      setNewNote("");
      fetchReport();
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (index) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/api/admin/operation-reports/${id}/notes/${index}`);
      toast.success("Note deleted");
      fetchReport();
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  if (fetching) return <Loader />;
  if (!report) return <div className="p-6">Report not found</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/operation-reports")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-2xl font-bold">{report.company_name}</h1>
          <div className="w-20" />
        </div>

        {/* Logo */}
        {report.logoBase64 && (
          <div className="flex justify-center mb-6">
            <img
              src={
                report.logoBase64.startsWith("data:")
                  ? report.logoBase64
                  : `data:image/png;base64,${report.logoBase64}`
              }
              alt={`${report.company_name} logo`}
              className="w-32 h-32 object-contain rounded-lg border bg-white p-2"
            />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Field label="Status" value={report.status} />
          <Field label="Operation Status" value={report.operation_status || "Demo"} />
          <Field label="Email" value={report.email} />
          <Field label="Main Location" value={report.main_location} />
          <Field
            label="Branches"
            value={
              report.branches_locations?.length > 0
                ? report.branches_locations.join(", ")
                : "-"
            }
          />
          <Field label="Payment Cycle" value={report.payment_cycle} />
          <Field label="Payment Amount" value={report.payment_amount} />
          <Field label="Contact Person" value={report.contact_person_name} />
          <Field label="Contact Phone" value={report.contact_person_phone} />
          <Field label="Sales Man" value={report.sales_man_name} />
          <Field label="Sales Phone" value={report.sales_man_phone} />
        </div>

        {/* Notes Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>

          {/* Add Note */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            />
            <button
              onClick={handleAddNote}
              disabled={addingNote || !newNote.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={16} /> Add
            </button>
          </div>

          {/* Notes List */}
          {report.notes?.length > 0 ? (
            <ul className="space-y-3">
              {report.notes.map((note, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border rounded-lg p-3 flex justify-between items-start"
                >
                  <div>
                    <p className="text-gray-800">{note.text}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">No notes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="text-gray-900 font-medium">{value || "-"}</p>
  </div>
);

export default OperationReportView;
