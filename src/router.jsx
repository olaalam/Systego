// src/router/index.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/Pages/Dashboard";
import Client from "@/Pages/Client/Client";
import ClientAdd from "@/Pages/Client/ClientAdd";
import Theme from "@/Pages/Theme/Theme";
import LoginPage from "@/components/Login";
import NotFoundPage from "@/Pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import Coupons from "./Pages/Coupons/Coupons";
import CouponAdd from "./Pages/Coupons/CouponAdd";
import CouponEdit from "./Pages/Coupons/CouponEdit";
import PackageAdd from "./Pages/Packages/PackageAdd";
import PackageEdit from "./Pages/Packages/PackageEdit";
import PaymentMethods from "./Pages/PaymentMethod/PaymentMethod";
import PaymentMethodAdd from "./Pages/PaymentMethod/PaymentMethodAdd";
import PaymentMethodEdit from "./Pages/PaymentMethod/PaymentMethodEdit";
import Package from "./Pages/Packages/Package";
import ThemeAdd from "./Pages/Theme/ThemeAdd";
import ThemeEdit from "./Pages/Theme/ThemeEdit";
import ClientEdit from "./Pages/Client/ClientEdit";
import ThemeCategoriesPage from "./Pages/ThemeCategories/ThemeCategories";
import ThemeCategoriesAdd from "./Pages/ThemeCategories/ThemeCategoriesAdd";
import ThemeCategoriesEdit from "./Pages/ThemeCategories/ThemeCategoriesEdit";
import TemplatePage from "./Pages/Templates/Template";
import OperationReports from "./Pages/OperationReports/OperationReports";
import OperationReportView from "./Pages/OperationReports/OperationReportView";
import CreateAdmin from "./Pages/Admins/CreateAdmin";
import Payments from "./Pages/Payments/Payments";

export default function AppRoutes() {
  return (
    <Routes>
      {/* âœ… Auth (Ù…ÙØªÙˆØ­) */}
      <Route path="/login" element={<LoginPage />} />

      {/* âœ… Dashboard (super_admin Ø¨Ø³) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* âœ… Create Admin (super_admin Ø¨Ø³) */}
      <Route
        path="create-admin"
        element={
          <ProtectedRoute>
            <CreateAdmin />
          </ProtectedRoute>
        }
      />

      {/* âœ… Theme (super_admin Ø¨Ø³) */}
      <Route path="theme">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Theme />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ThemeAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ThemeEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Client (super_admin Ø¨Ø³) */}
      <Route path="client">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Client />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ClientAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ClientEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Coupons (super_admin Ø¨Ø³) */}
      <Route path="coupons">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Coupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <CouponAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <CouponEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Package (super_admin Ø¨Ø³) */}
      <Route path="packages">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Package />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PackageAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PackageEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… PaymentMethod (super_admin Ø¨Ø³) */}
      <Route path="payment-method">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PaymentMethods />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PaymentMethodAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PaymentMethodEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Theme Categories (super_admin Ø¨Ø³) */}
      <Route path="theme-categories">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ThemeCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ThemeCategoriesAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <ThemeCategoriesEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Template (super_admin Ø¨Ø³) */}
      <Route path="template">
        <Route
          index
          element={
            <ProtectedRoute requiredRole="super_admin">
              <TemplatePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âœ… Operation Reports (Ø§Ù„ÙƒÙ„ ÙŠØ¯Ø®Ù„Ù‡Ø§ â€” super_admin + viewer) */}
      <Route path="operation-reports">
        <Route
          index
          element={
            <ProtectedRoute>
              <OperationReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="view/:id"
          element={
            <ProtectedRoute>
              <OperationReportView />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* âŒ 404 - Not Found Route */}
      {/* Payments (super_admin) */}
      <Route
        path="payments"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
