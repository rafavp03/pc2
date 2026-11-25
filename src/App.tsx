import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import DetailPage from "./pages/DetailPage";
import MyOperationsPage from "./pages/MyOperationsPage";

export default function App() {
  return (
    <Routes>
      {/* Publicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/detalle/:id" element={<DetailPage />} />
        <Route path="/mis-operaciones" element={<MyOperationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
