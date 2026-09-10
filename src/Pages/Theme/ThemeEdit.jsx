// src/pages/ThemeEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";

// 🔤 قائمة بالخطوط الشائعة مع نصوص معاينة
const POPULAR_FONTS = [
  { name: "Cairo", arPreview: "القاهرة خط حديث وواضح", enPreview: "Modern & Clean Sans" },
  { name: "Tajawal", arPreview: "تجول خط عربي أنيق", enPreview: "Elegant Arabic Design" },
  { name: "Almarai", arPreview: "المراعي خط عصري للمتاجر", enPreview: "Perfect for E-commerce" },
  { name: "Amiri", arPreview: "أميري خط نسخ أصيل ورائع", enPreview: "Classic Naskh Style" },
  { name: "Inter", arPreview: "خط انتر الممتاز للواجهات", enPreview: "UI Standard Font" },
  { name: "Roboto", arPreview: "روبوتو الخط الرسمي والتطبيقات", enPreview: "Google Standard Sans" },
  { name: "Poppins", arPreview: "بوبينز خط هادي ومميز", enPreview: "Geometric & Modern" },
  { name: "Montserrat", arPreview: "مونتسيرات خط احترافي وعريض", enPreview: "Bold & Distinctive" },
  { name: "Playfair Display", arPreview: "بلايفير خط فخم للعناوين", enPreview: "Luxury Serif Font" }
];

export default function ThemeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. جلب بيانات الثيم باستخدام useGet (ملاحظة: useGet يخزن res.data.data مباشرة)
  const { data: theme, loading: getLoading, error: getError } = useGet(`/api/admin/themes/${id}`);
  
  // 2. استخدام usePut الخاص بك للتحديث
  const { putData, loading: saving } = usePut(`/api/admin/themes/${id}`);

  // حالة الفورم (Form State)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isBase: false,
    defaultConfig: {
      colorKeys: [],
      fontOptions: []
    }
  });

  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [customFontInput, setCustomFontInput] = useState("");

  // تحميل خطوط Google Fonts تلقائياً للمعاينة الحية
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&family=Amiri&family=Cairo:wght@400;700&family=Inter:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:ital@0;1&family=Poppins:wght@400;700&family=Roboto:wght@400;700&family=Tajawal:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // تعبئة البيانات عند التحميل من useGet
useEffect(() => {
  // فحص ما إذا كانت البيانات داخل theme.data بسبب تجويف الـ Backend
  const actualTheme = theme?.data || theme;

  if (actualTheme) {
    setFormData({
      name: actualTheme.name || "",
      description: actualTheme.description || "",
      isBase: actualTheme.isBase || false,
      defaultConfig: {
        colorKeys: actualTheme.defaultConfig?.colorKeys || [],
        fontOptions: actualTheme.defaultConfig?.fontOptions || []
      }
    });
  }
}, [theme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // دالة إضافة عنصر للمصفوفات بدون تكرار
  const handleAddConfigItem = (field, value) => {
    if (!value || !value.trim()) return;
    const trimmedVal = value.trim();

    if (formData.defaultConfig[field].includes(trimmedVal)) {
      toast.info("Item is already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      defaultConfig: {
        ...prev.defaultConfig,
        [field]: [...prev.defaultConfig[field], trimmedVal]
      }
    }));
  };

  // دالة حذف عنصر من المصفوفات
  const handleRemoveConfigItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      defaultConfig: {
        ...prev.defaultConfig,
        [field]: prev.defaultConfig[field].filter((_, i) => i !== index)
      }
    }));
  };

  // دالة الحفظ باستخدام usePut
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await putData(formData);
      toast.success("Theme updated successfully!");
      navigate("/theme");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update theme");
    }
  };

  if (getLoading) return <Loader />;
  if (getError) return <div className="p-6 text-red-500">Error loading theme: {getError}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Theme</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        {/* isBase Switch */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Base Theme?</label>
            <p className="text-xs text-gray-500">Enable if this is a core layout template.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isBase"
              checked={formData.isBase}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <hr className="border-gray-200" />

        {/* 🎨 Color Palette */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Palette</label>

          <div className="flex flex-wrap gap-3 mb-3">
            {formData.defaultConfig.colorKeys.length === 0 ? (
              <span className="text-xs text-gray-400 italic">No colors added yet.</span>
            ) : (
              formData.defaultConfig.colorKeys.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-3 py-1.5 rounded-lg shadow-sm"
                >
                  <span
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono font-medium text-gray-700">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConfigItem("colorKeys", index)}
                    className="text-gray-400 hover:text-red-500 font-bold ml-1 text-sm transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-white focus-within:border-primary">
              <input
                type="color"
                value={selectedColor.startsWith("#") ? selectedColor : "#3b82f6"}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#HEX or color name"
                className="px-2 text-sm font-mono w-36 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddConfigItem("colorKeys", selectedColor)}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition"
            >
              Add Color
            </button>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* 🔤 Font Options مع المعاينة الحية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selected Font Options</label>
          <p className="text-xs text-gray-500 mb-3">
            These are the active font choices for this theme.
          </p>

          {/* 1. الخطوط المختارة حالياً */}
          <div className="flex flex-wrap gap-2 mb-6">
            {formData.defaultConfig.fontOptions.length === 0 ? (
              <span className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg w-full block border border-dashed text-center">
                No fonts selected yet. Choose from the gallery below or add custom ones.
              </span>
            ) : (
              formData.defaultConfig.fontOptions.map((font, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <span
                    className="text-base font-semibold text-purple-900"
                    style={{ fontFamily: `'${font}', sans-serif` }}
                  >
                    {font}
                  </span>
                  <span className="text-[10px] text-purple-600 bg-white px-1.5 py-0.5 rounded border border-purple-200">
                    Active
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConfigItem("fontOptions", index)}
                    className="text-purple-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 2. معرض الخطوط مع عينات حية */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Font Preview Gallery (Click to Add)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {POPULAR_FONTS.map((fontObj) => {
                const isSelected = formData.defaultConfig.fontOptions.includes(fontObj.name);

                return (
                  <div
                    key={fontObj.name}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-50/50 border-purple-300 ring-1 ring-purple-300"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-gray-500">{fontObj.name}</span>
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Added
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddConfigItem("fontOptions", fontObj.name)}
                            className="text-xs bg-gray-900 hover:bg-purple-700 text-white px-2.5 py-1 rounded-md transition-colors"
                          >
                            + Add
                          </button>
                        )}
                      </div>

                      <div
                        className="space-y-1 my-1 p-2 bg-slate-50 rounded-lg border border-slate-100"
                        style={{ fontFamily: `'${fontObj.name}', sans-serif` }}
                      >
                        <p className="text-sm font-medium text-gray-800 leading-snug">
                          {fontObj.arPreview}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fontObj.enPreview}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. إضافة خط مخصص */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Add Unlisted Custom Font
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customFontInput}
                onChange={(e) => setCustomFontInput(e.target.value)}
                placeholder="e.g. Traditional Arabic"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddConfigItem("fontOptions", customFontInput);
                    setCustomFontInput("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  handleAddConfigItem("fontOptions", customFontInput);
                  setCustomFontInput("");
                }}
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition flex-shrink-0"
              >
                Add Font
              </button>
            </div>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate("/theme")} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}