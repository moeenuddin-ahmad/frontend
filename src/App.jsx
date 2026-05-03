import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Shops from "./pages/Shops";
import ShopDetails from "./pages/ShopDetails";
import CreateShop from "./pages/CreateShop";
import EditShop from "./pages/EditShop";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthGuard from "./routes/AuthGuard";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with MainLayout */}
      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Shops />} />
          <Route path="/shop/create" element={<CreateShop />} />
          <Route path="/shop/:id" element={<ShopDetails />} />
          <Route path="/shop/:id/edit" element={<EditShop />} />
          <Route path="/shop/:id/product/create" element={<CreateProduct />} />
          <Route
            path="/shop/:id/product/:productId/edit"
            element={<EditProduct />}
          />
          <Route path="/about" element={<About />} />
        </Route>
      </Route>

      {/* Catch-all 404 — must be LAST */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
