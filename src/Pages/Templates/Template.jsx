import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, Layers3, Palette, FolderOpen, Plus } from "lucide-react";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";

const normalizeList = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  return [];
};

export default function TemplatePage() {
  const navigate = useNavigate();
  const { data: categoriesData, loading: categoriesLoading } = useGet("/api/admin/theme-categories");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = normalizeList(categoriesData, "categories");
  const categoryMap = useMemo(
    () =>
      Object.fromEntries(
        categories.map((item) => [String(item._id), item])
      ),
    [categories]
  );

  const themesUrl =
    selectedCategory === "all"
      ? "/api/admin/themes"
      : `/api/admin/themes?categoryId=${selectedCategory}`;

  const { data: themesData, loading: themesLoading } = useGet(themesUrl);
  const themes = normalizeList(themesData, "themes");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Templates</h1>
          <p className="text-sm text-gray-500">
            Manage theme templates by category and review their configuration.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => navigate("/theme-categories/add")}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <FolderOpen size={18} />
            Add Category
          </button>

          <button
            type="button"
            onClick={() => navigate("/theme/add")}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            <Plus size={18} />
            Add Theme
          </button>
        </div>
      </div>

      {(categoriesLoading || themesLoading) && <Loader />}

      {!categoriesLoading && !themesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {themes.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
              No templates found for this category.
            </div>
          ) : (
            themes.map((theme) => {
              const category = theme.category || categoryMap[String(theme.categoryId)] || {};
              const defaultConfig = theme.defaultConfig || {};
              const colorKeys = defaultConfig.colorKeys || [];
              const fontOptions = defaultConfig.fontOptions || [];

              return (
                <div key={theme._id || theme.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                    {theme.image ? (
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon size={36} />
                        <span className="mt-2 text-sm">No preview</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-gray-800">{theme.name}</h2>
                      {theme.isBase && (
                        <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          Base
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FolderOpen size={15} />
                      <span>{category.name || "Uncategorized"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Layers3 size={15} />
                      <span>{theme.sections?.length || 0} sections</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Palette size={15} />
                        <span>{colorKeys.length} color keys</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {colorKeys.slice(0, 4).map((key) => (
                          <span key={key} className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                            {key}
                          </span>
                        ))}
                        {colorKeys.length > 4 && (
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                            +{colorKeys.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {fontOptions.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Fonts: {fontOptions.join(", ")}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/theme/edit/${theme._id || theme.id}`)}
                      className="w-full mt-2 bg-secondary text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Edit Template
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
