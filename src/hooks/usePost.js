// src/hooks/usePost.js
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/api/api";

export default function usePost(defaultUrl) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body = {}, customUrl = null) => {
    try {
      setLoading(true);
      const res = await api.post(customUrl || defaultUrl, body);

      if (res.data?.success) {
        toast.success(res.data?.message || "Success!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(res.data?.error?.message || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Request failed";

      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
}
