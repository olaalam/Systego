// src/hooks/usePost.js
import { useState } from "react";
import api from "@/api/api";

export default function usePost(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body) => {
    try {
      setLoading(true);
      const res = await api.post(url, body);
      return res.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
}
