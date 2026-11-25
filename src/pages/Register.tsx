import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { register } from "../api/auth";
import { getError } from "../api/client";

type Errors = { name?: string; email?: string; password?: string; general?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, email: string, password: string): Errors {
  const e: Errors = {};
  const n = name.trim();
  if (n.length === 0) e.name = "El nombre es obligatorio";
  else if (n.length > 100) e.name = "Máximo 100 caracteres";
  if (!EMAIL_RE.test(email) || email.length > 254) e.email = "Correo inválido";
  if (password.length < 8 || password.length > 72) e.password = "Debe tener de 8 a 72 caracteres";
  return e;
}

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate(name, email, password);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      await register({ name: name.trim(), email, password });
      navigate("/login");
    } catch (err) {
      const { code, message } = getError(err);
      if (code === "EMAIL_EXISTS") setErrors({ email: "Ese correo ya está registrado" });
      else setErrors({ general: message ?? "No se pudo registrar" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Crear cuenta</h1>

      <Field label="Nombre" htmlFor="name" error={errors.name}>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field label="Correo" htmlFor="email" error={errors.email}>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Field label="Contraseña" htmlFor="password" error={errors.password}>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>

      {errors.general && <p role="alert">{errors.general}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrarme"}
      </button>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}