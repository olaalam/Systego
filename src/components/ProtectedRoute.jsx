import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  // مش مسجل دخول → Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // لو الصفحة محتاجة role معين والـ user مش عنده
  if (requiredRole && admin.role !== requiredRole) {
    // الـ viewer مش المفروض يدخل هنا → يروح Operation Reports
    if (admin.role === "viewer") {
      return <Navigate to="/operation-reports" replace />;
    }
    // أي حالة تانية → Dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
