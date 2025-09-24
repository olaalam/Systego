// src/hooks/useDelete.js
import { useState } from "react";
import api from "@/api/api";

export default function useDelete(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await api.delete(url);
      return res.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
}
