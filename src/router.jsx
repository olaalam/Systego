// src/router/index.jsx
import { Routes, Route } from "react-router-dom";

import Dashboard from "@/Pages/Dashboard";
import Payments from "@/Pages/Payments";
import Client from "@/Pages/Client/Client";
import ClientAdd from "@/Pages/Client/ClientAdd";
import ClientEdit from "@/Pages/Client/ClientEdit";
import Theme from "@/Pages/Theme";
import LoginPage from "@/components/Login";
import NotFoundPage from "@/Pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute"; // ✅
import Coupons from "./Pages/Coupons/Coupons";
import CouponAdd from "./Pages/Coupons/CouponAdd";
import CouponEdit from "./Pages/Coupons/CouponEdit";
import PackageAdd from "./Pages/Packages/PackageAdd";
import PackageEdit from "./Pages/Packages/PackageEdit";
import { Package } from "lucide-react";
import PaymentMethods from "./Pages/PaymentMethod/PaymentMethod";
import PaymentMethodAdd from "./Pages/PaymentMethod/PaymentMethodAdd";
import PaymentMethodEdit from "./Pages/PaymentMethod/PaymentMethodEdit";

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
      <Route
        path="theme"
        element={
          <ProtectedRoute>
            <Theme />
          </ProtectedRoute>
        }
      />

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
      <Route path="package">
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

      {/* ❌ 404 - Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
