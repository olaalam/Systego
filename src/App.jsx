import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import AppRoutes from "@/router";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/App.css";

// المكون الرئيسي الذي سيحتوي على منطق إخفاء الشريط الجانبي والشريط العلوي
const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex">
      {/* إخفاء Sidebar إذا كنا في صفحة تسجيل الدخول */}
      {!isLoginPage && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {/* إخفاء Navbar إذا كنا في صفحة تسجيل الدخول */}
        {!isLoginPage && <Navbar />}

        <main className="flex-1  bg-gray-50">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <MainLayout />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}