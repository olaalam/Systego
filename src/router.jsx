// src/router/index.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/Pages/Dashboard";
import Client from "@/Pages/Client/Client";
import ClientAdd from "@/Pages/Client/ClientAdd";
import Theme from "@/Pages/Theme/Theme";
import LoginPage from "@/components/Login";
import NotFoundPage from "@/Pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute"; // ✅
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ Main Pages محمية */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* ✅ Theme (Nested Routes محمية) */}
      <Route path="theme">
        <Route
          index
          element={
            <ProtectedRoute>
              <Theme />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <ThemeAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <ThemeEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ✅ Client (Nested Routes محمية) */}
      <Route path="client">
        <Route
          index
          element={
            <ProtectedRoute>
              <Client />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <ClientAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <ClientEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ✅ Coupons (Nested Routes محمية) */}
      <Route path="coupons">
        <Route
          index
          element={
            <ProtectedRoute>
              <Coupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <CouponAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <CouponEdit />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* ✅ Package (Nested Routes محمية) */}
      <Route path="packages">
        <Route
          index
          element={
            <ProtectedRoute>
              <Package />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <PackageAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <PackageEdit />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* ✅ PaymentMethod (Nested Routes محمية) */}
      <Route path="payment-method">
        <Route
          index
          element={
            <ProtectedRoute>
              <PaymentMethods />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <PaymentMethodAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <PaymentMethodEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="theme-categories">
        <Route
          index
          element={
            <ProtectedRoute>
              <ThemeCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <ThemeCategoriesAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <ThemeCategoriesEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="template">
        <Route
          index
          element={
            <ProtectedRoute>
              <TemplatePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ❌ 404 - Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
