import React, { useState, useEffect } from "react";
import api from "@/api/api";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/payments");
      setPayments(res?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setActing(id);
    try {
      await api.post(`/api/admin/payments/${id}/approve`);
      toast.success("Payment approved. Subscription activated.");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve");
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id) => {
    setActing(id);
    try {
      await api.post(`/api/admin/payments/${id}/reject`);
      toast.success("Payment rejected.");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No pending payments.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Package</th>
                <th className="px-4 py-3 text-left">Cycle</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Screenshot</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-3">{p.client_id?.company_name || p.client_id}</td>
                  <td className="px-4 py-3">{p.package_id?.name || "-"}</td>
                  <td className="px-4 py-3">{p.payment_cycle}</td>
                  <td className="px-4 py-3">{p.amount}</td>
                  <td className="px-4 py-3">{p.date ? new Date(p.date).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "approve"
                          ? "bg-green-100 text-green-800"
                          : p.status === "reject"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.screenshot ? (
                      <a href={p.screenshot} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {p.status === "pending" ? (
                      <>
                        <button
                          disabled={acting === p._id}
                          onClick={() => handleApprove(p._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          disabled={acting === p._id}
                          onClick={() => handleReject(p._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
