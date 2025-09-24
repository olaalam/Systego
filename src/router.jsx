import { Routes, Route } from "react-router-dom"

// صفحاتك
import Dashboard from "@/Pages/Dashboard"
import Payments from "@/Pages/Payments"
import Client from "@/Pages/Client/Client"
import ClientAdd from "@/Pages/Client/ClientAdd"
import ClientEdit from "@/Pages/Client/ClientEdit"
import Theme from "@/Pages/Theme"
import LoginPage from "@/components/Login"
import NotFoundPage from "@/Pages/NotFound"

// استوردي باقي الصفحات هنا بنفس الشكل

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ Main Pages */}
      <Route path="/" element={<Dashboard />} />
      <Route path="payments" element={<Payments />} />
      <Route path="theme" element={<Theme />} />

      {/* ✅ Client (Nested Routes) */}
      <Route path="client">
        <Route index element={<Client />} />
        <Route path="add" element={<ClientAdd />} />
        <Route path="edit/:id" element={<ClientEdit />} />
      </Route>

      {/* ❌ 404 - Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
