import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import StoreLayout from "@/layouts/StoreLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Confirmation from "@/pages/Confirmation";
import About from "@/pages/About";
import CafeTouba from "@/pages/CafeTouba";
import CafeToubaProduct from "@/pages/CafeToubaProduct";
import CafeToubaCart from "@/pages/CafeToubaCart";
import CafeToubaCheckout from "@/pages/CafeToubaCheckout";
import CafeToubaConfirmation from "@/pages/CafeToubaConfirmation";
import NotFound from "@/pages/NotFound";

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminProductForm = lazy(() => import("@/pages/admin/ProductForm"));
const AdminColors = lazy(() => import("@/pages/admin/Colors"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminShipping = lazy(() => import("@/pages/admin/Shipping"));
const AdminReviews = lazy(() => import("@/pages/admin/Reviews"));
const AdminHomepage = lazy(() => import("@/pages/admin/Homepage"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminCafeToubaProducts = lazy(() => import("@/pages/admin/CafeToubaProducts"));
const AdminCafeToubaProductForm = lazy(() => import("@/pages/admin/CafeToubaProductForm"));
const AdminCafeToubaOrders = lazy(() => import("@/pages/admin/CafeToubaOrders"));

function AdminFallback() {
  return <div className="min-h-screen flex items-center justify-center text-sm">Chargement…</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/boutique" element={<Shop />} />
        <Route path="/produit/:id" element={<Product />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/commande" element={<Checkout />} />
        <Route path="/confirmation/:orderNumber" element={<Confirmation />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/cafe-touba" element={<CafeTouba />} />
        <Route path="/cafe-touba/produit/:id" element={<CafeToubaProduct />} />
        <Route path="/cafe-touba/panier" element={<CafeToubaCart />} />
        <Route path="/cafe-touba/commander" element={<CafeToubaCheckout />} />
        <Route path="/cafe-touba/confirmation/:orderNumber" element={<CafeToubaConfirmation />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produits" element={<AdminProducts />} />
        <Route path="produits/:id" element={<AdminProductForm />} />
        <Route path="couleurs" element={<AdminColors />} />
        <Route path="commandes" element={<AdminOrders />} />
        <Route path="livraison" element={<AdminShipping />} />
        <Route path="avis" element={<AdminReviews />} />
        <Route path="accueil" element={<AdminHomepage />} />
        <Route path="parametres" element={<AdminSettings />} />
        <Route path="cafe-touba/produits" element={<AdminCafeToubaProducts />} />
        <Route path="cafe-touba/produits/:id" element={<AdminCafeToubaProductForm />} />
        <Route path="cafe-touba/commandes" element={<AdminCafeToubaOrders />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

