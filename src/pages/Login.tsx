import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { login } from "../api/auth";
import { getError } from "../api/client";
import { RESOURCE } from "../api/resource";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password }); // guarda el token
      navigate(`/${RESOURCE}`);
    } catch (err) {
      const { status } = getError(err);
      if (status === 401 || status === 400) setError("Correo o contraseña incorrectos");
      else setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <Field label="Correo" htmlFor="email">
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  );
}