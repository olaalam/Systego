import { Routes, Route } from "react-router-dom"
// import Dashboard from "@/Pages/Dashboard"
import Payments from "@/Pages/Payments"
import Client from "@/Pages/Client/Client"
import ClientAdd from "@/Pages/Client/ClientAdd"
import ClientEdit from "./Pages/Client/ClientEdit"
import Theme from "./Pages/Theme"
import LoginPage from "./components/Login"
import PosLayout from "./Pages/POS/PosLayout"
// استوردي باقي الصفحات هنا

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/" element={<Dashboard />} /> */}

      {/* ✅ Nested Routes for Client */}
      <Route path="client">
        <Route index element={<Client />} />
        <Route path="add" element={<ClientAdd />} />
        <Route path="edit/:id" element={<ClientEdit />} />
      </Route>
      <Route path="/point-of-sale" element={<PosLayout />} />
      <Route path="payments" element={<Payments />} />
      <Route path="theme" element={<Theme />} />

      {/* باقي الصفحات */}
    </Routes>
  )
}
