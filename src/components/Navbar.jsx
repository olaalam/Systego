import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 👈 يرجع خطوة ورا
  };

  const handleLogout = () => {
    // احذف بيانات اليوزر (token/session)
    localStorage.removeItem("token");
    // روح لصفحة الـ login
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5 text-secondary" />
        <span className="text-sm font-medium text-secondary">Back</span>
      </button>

      {/* Logo / Title */}
      <h1 className="text-lg font-bold text-secondary">SysteGo</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-secondary hover:text-purple-600 cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </nav>
  );
}
