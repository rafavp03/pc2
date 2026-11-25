import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import ItemCard from "../components/ItemCard";
import { list } from "../api/resource";
import type { Item } from "../api/resource";
import type { Page } from "../types";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<Item> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    list(page)
      .then(setData)
      .catch(() => setError("No se pudo cargar el listado"))
      .finally(() => setLoading(false));
  }, [page, recarga]);

  const items = data?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div>
      <Navbar title="Mentorías UTEC" />

      {loading && <p>Cargando...</p>}
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" 
                    onClick={()=>setRecarga((n) => n + 1)}>
                Reintentar
            </button></div>
      )}
      {!loading && !error && isEmpty && <p>No hay registros para mostrar.</p>}

      {!loading && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 0}
        isEmpty={isEmpty}
        disabled={loading}
        onChange={setPage}
      />
    </div>
  );
}