import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

type Props = { title: string };

export default function Navbar({ title }: Props) {
  const navigate = useNavigate();

  function handleLogout() {
    logout(); // borra el token de localStorage
    navigate("/login", { replace: true });
  }

  return (
    <header className="mb-6 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-4">
        <h1 className="mr-auto text-xl font-semibold text-slate-900">{title}</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-blue-700 hover:underline">
            Salas
          </Link>
          <Link to="/my-bookings" className="text-blue-700 hover:underline">
            Mis reservas
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Cerrar sesion
          </button>
        </nav>
      </div>
    </header>
  );
}
