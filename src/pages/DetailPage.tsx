import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Field from "../components/Field";
import { getById, sendAction } from "../api/resource";
import type { Detail } from "../api/resource";
import { getError } from "../api/client";

type Errors = { slotId?: string; text?: string; general?: string };

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [text, setText] = useState("");

  const [slotId, setSlotId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  async function load() {
    try {
      setItem(await getById(id!));
    } catch (err) {
      if (getError(err).status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  function validate(): Errors {

    const e: Errors = {};
    const slot = item?.slots.find((s) => s.id === Number(slotId));
    if (!slot || !slot.availableSlots) e.slotId = "Selecciona un mentor disponible";

    if (text.trim().length < 5 || text.trim().length > 100)
      e.text = "El texto debe tener entre 5 y 100 caracteres";

    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSending(true);
    try {
      await sendAction(id!, { slotId: Number(slotId), text: text });
      setSuccess(`Reserva confirmada`);
      setSlotId("");
      await load();
    } catch (err) {
      const { code, message } = getError(err);
      if (code === "SLOT_TAKEN") setErrors({ general: "El turno ya no está disponible." });
      else setErrors({ general: message ?? "No se pudo completar la operación" });
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (notFound || !item)
    return (
      <p>
        No se encontró el registro. <Link to={"/api"}>Volver</Link>
      </p>
    );

  return (
    <div>
      <Navbar title={item.name} />
      <Link to={"/api"}>Volver al listado</Link>

      <section>
        <p>Nombre: {item.name}</p>
        <p>Descripción: {item.description}</p>
        <p>Especialidad: {item.specialty}</p>
        <p>Modalidad: {item.modality}</p>
        <p>Cupos disponibles: {item.availableSlots}</p>
      </section>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Turno" htmlFor="slotId" error={errors.slotId}>
          <select id="slotId" value={slotId} onChange={(e) => setSlotId(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {item.slots
              .filter((s) => s.availableSlots > 0)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Tema de la mentoría" htmlFor="text" error={errors.text}>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>

        {errors.general && <p role="alert">{errors.general}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Reservar"}
        </button>
      </form>
    </div>
  );
}