import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function ThemesPage() {
  const [themes, setThemes] = useState([
    { id: 1, name: "Default Theme", files: [] },
  ]);

  const handleAddTheme = () => {
    const newId = themes.length + 1;
    setThemes([...themes, { id: newId, name: `Theme ${newId}`, files: [] }]);
  };

  const handleUpload = (id, event) => {
    const files = Array.from(event.target.files);
    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === id ? { ...theme, files } : theme
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Themes Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Upload Theme Files</span>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => handleUpload(theme.id, e)}
                />
              </label>

              {theme.files.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1">
                  {theme.files.map((file, idx) => (
                    <li key={idx}>📄 {file.name}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        {/* زرار إضافة ثيم جديد */}
        <button
          onClick={handleAddTheme}
          className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <Plus className="w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-600">Add Theme</span>
        </button>
      </div>
    </div>
  );
}
