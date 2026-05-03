import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Products from "./pages/Products";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
