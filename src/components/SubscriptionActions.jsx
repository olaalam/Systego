import React, { useState } from "react";
import api from "@/api/api";
import { toast } from "react-toastify";
import { CreditCard, CalendarClock } from "lucide-react";

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SubscriptionActions({
  clientId,
  client,
  onUpdated,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const [endDate, setEndDate] = useState(toDateInput(client?.subscription_end_date || client?.subscription?.endDate));
  const [amount, setAmount] = useState(client?.payment_amount || "");
  const [saving, setSaving] = useState(false);

  const refreshLocal = (updated) => {
    if (onUpdated) onUpdated(updated);
    setEndDate(toDateInput(updated?.subscription_end_date || updated?.subscription?.endDate));
    setOpen(false);
  };

  const handleRenew = async () => {
    setSaving(true);
    try {
      const res = await api.post(`/api/admin/clients/${clientId}/renew-subscription`, {
        amount: amount === "" ? undefined : Number(amount),
      });
      const updated = res.data?.data?.data || res.data?.data;
      toast.success("Payment recorded. Subscription extended.");
      refreshLocal(updated);
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to record payment",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetEndDate = async () => {
    if (!endDate) {
      toast.error("Please choose an end date");
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch(`/api/admin/clients/${clientId}/subscription-end`, {
        subscription_end_date: endDate,
      });
      const updated = res.data?.data?.data || res.data?.data;
      toast.success(res.data?.data?.message || "Subscription date updated");
      refreshLocal(updated);
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update end date",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "inline-flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 font-medium"
            : "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
        }
        title="Renew or set subscription end date"
      >
        <CreditCard size={14} />
        Manage
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Subscription — {client?.company_name || "Client"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Record a payment to extend by the payment cycle, or keep the client active until a date you choose.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment amount
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Amount"
              />
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleRenew}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              <CreditCard size={16} />
              Record payment & extend cycle
            </button>

            <div className="border-t pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keep active until
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSetEndDate}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              <CalendarClock size={16} />
              Activate until this date
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => setOpen(false)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
