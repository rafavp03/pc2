import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { myOperations, cancelBooking } from "../api/resource";
import type { Booking, Operations } from "../api/resource";
import { getError } from "../api/client";

export default function MyOperationsPage() {
  const [items, setItems] = useState<Operations<Booking>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aviso, setAviso] = useState("");
  const [avisoError, setAvisoError] = useState("");
  const [accionandoId, setAccionandoId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await myOperations());
    } catch {
      setError("No se pudieron cargar tus registros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAccion(it: Operations<Booking>) {
    const operationId = (it as Operations<Booking> & { id: number }).id;
    if (!window.confirm(`Cancelar el registro N.0 ${operationId}?`)) return;

    setAviso("");
    setAvisoError("");
    setAccionandoId(operationId);
    try {
      await cancelBooking(operationId);
      setAviso("Registro cancelado.");
      await load();
    } catch (err) {
      const { code, message } = getError(err);
      if (code === "INVALID_STATE") {
        setAvisoError("El registro ya cambio de estado. Se actualizo la lista.");
        await load();
      } else {
        setAvisoError(message ?? "No se pudo completar la operacion.");
      }
    } finally {
      setAccionandoId(null);
    }
  }

  const isEmpty = !loading && !error && items.length === 0;

  return (
    <div>
      <Navbar title="Mis reservas" />

      {aviso && <p>{aviso}</p>}
      {avisoError && <p role="alert">{avisoError}</p>}

      {loading && <p>Cargando...</p>}

      {error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={load}>
            Reintentar
          </button>
        </div>
      )}

      {isEmpty && <p>Todavia no tienes registros.</p>}

      {!loading && !error && items.length > 0 && (
        <ul>
          {items.map((it) => (
            <li key={(it as Operations<Booking> & { id: number }).id}>

              {(it as Operations<Booking> & {status: "ACTIVE" | "CANCELLED" | "COMPLETED"}).status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => handleAccion(it)}
                  disabled={accionandoId === (it as Operations<Booking> & { id: number }).id}
                >
                  {accionandoId === (it as Operations<Booking> & { id: number }).id ? "Enviando..." : "Cancelar"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
