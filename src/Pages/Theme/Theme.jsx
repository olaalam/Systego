// src/pages/ThemesPage.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "@/components/DeleteForm";

export default function ThemesPage() {
  // جلب قائمة الثيمات
  const { data, loading, error } = useGet("/api/admin/themes/");
  
  // جلب الأقسام من الـ Endpoint الصحيح
  const { data: categoriesRes } = useGet("/api/admin/theme-categories");
  
  const { deleteData, loading: deleteLoading } = useDelete();
  const [themes, setThemes] = useState([]);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🔍 استخراج مصفوفة الكاتيجوريز بأمان
  const rawCategories = categoriesRes?.data?.categories ?? categoriesRes?.categories ?? [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  
  const categoryNameById = categories.reduce((acc, cat) => {
    acc[cat._id] = cat.ar_name || cat.name;
    return acc;
  }, {});

  useEffect(() => {
    // 🔍 استخراج مصفوفة الثيمات بأمان بغض النظر عن مستوى التغليف (Nested Data)
    const rawList = data?.data?.data || data?.data || data || [];
    const themesArray = Array.isArray(rawList) ? rawList : [];

    if (themesArray.length > 0) {
      setThemes(
        themesArray.map((t) => ({
          id: t._id,
          name: t.name || "Untitled Theme",
          description: t.description || "No description provided",
          theme: t.theme,
          isBase: t.isBase || false,
          categoryId: t.categoryId || null,
          colorCount: t.defaultConfig?.colorKeys?.length || 0,
          fontCount: t.defaultConfig?.fontOptions?.length || 0,
        }))
      );
    } else {
      setThemes([]);
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
      toast.success("Theme deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete theme");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">Failed to load themes</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Themes Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="shadow-md relative border border-gray-200">
            {/* زرار الحذف */}
            <button
              onClick={() => confirmDelete(theme.id)}
              disabled={deleteLoading}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Theme"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold">{theme.name}</CardTitle>
                {theme.isBase && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                    Base
                  </span>
                )}
              </div>
              {theme.categoryId && (
                <span className="inline-block text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full mt-1 w-fit">
                  {categoryNameById[theme.categoryId] || "Uncategorized"}
                </span>
              )}
              <p className="text-sm text-gray-500 line-clamp-2">{theme.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* تفاصيل سريعة عن الألوان والخطوط */}
              <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <span>🎨 {theme.colorCount} Colors</span>
                <span>🔤 {theme.fontCount} Fonts</span>
              </div>

              {/* رابط الـ Theme إن وجد */}
              {theme.theme && (
                <span className="block text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded w-fit">
                  Type: {theme.theme}
                </span>
              )}

              {/* زرار التعديل */}
              <button
                onClick={() => navigate(`/theme/edit/${theme.id}`)}
                className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
              >
                Edit Theme
              </button>
            </CardContent>
          </Card>
        ))}
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