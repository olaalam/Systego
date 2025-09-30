// src/pages/ThemesPage.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "@/components/DeleteForm"; // 👈 استدعاء الديالوغ

export default function ThemesPage() {
  const { data, loading, error } = useGet("/api/admin/themes/");
  const { deleteData, loading: deleteLoading } = useDelete();
  const [themes, setThemes] = useState([]);
  const navigate = useNavigate();

  // 👇 state للتحكم في المودال
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setThemes(
        data.data.map((t) => ({
          id: t._id,
          name: t.name,
          description: t.description,
          theme: t.theme,
          files: [],
        }))
      );
    }
  }, [data]);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deleteData(`/api/admin/themes/${selectedId}`);
      setThemes((prev) => prev.filter((theme) => theme.id !== selectedId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete theme");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to load themes</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Themes Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="shadow-md relative">
            {/* زرار الحذف */}
            <button
              onClick={() => confirmDelete(theme.id)}
              disabled={deleteLoading}
              className="absolute top-3 right-3 text-primary hover:text-teal-700"
              title="Delete Theme"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
              <p className="text-sm text-gray-500">{theme.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 👇 عرض الفايل */}
              {theme.theme && (
                <a
                  href={theme.theme}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-primary underline hover:text-teal-800"
                >
                  View Theme File
                </a>
              )}

              {/* زرار التعديل */}
              <button
                onClick={() => navigate(`/theme/edit/${theme.id}`)}
                className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-700"
              >
                Edit Theme
              </button>
            </CardContent>
          </Card>
        ))}

        {/* زرار إضافة ثيم جديد */}
        <button
          onClick={() => navigate("/theme/add")}
          className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <Plus className="w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-600">Add Theme</span>
        </button>
      </div>

      {/* 🗑️ Delete Dialog */}
      {openDialog && (
        <DeleteDialog
          title="Delete Theme"
          message="Are you sure you want to delete this theme? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setOpenDialog(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
