import { useEffect, useState } from "react";
import { crearCliente, actualizarCliente } from "../api/clientes";

const emptyCliente = {
  nombre: "",
  genero: "",
  edad: "",
  identificacion: "",
  direccion: "",
  telefono: "",
  estado: true,
  contrasena: "",
};

const normalize = (c) => ({
  ...emptyCliente,
  ...c,
  nombre: c?.nombre ?? "",
  genero: c?.genero ?? "",
  edad: c?.edad ?? "",
  identificacion: c?.identificacion ?? "",
  direccion: c?.direccion ?? "",
  telefono: c?.telefono ?? "",
  estado: c?.estado ?? true,
  contrasena: "",
});

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

export default function ClienteForm({ clienteInicial, onSaved, onCancel }) {
  const editando = Boolean(clienteInicial?.id);

  const [cliente, setCliente] = useState(() => normalize(clienteInicial));
  const [error, setError] = useState("");

  useEffect(() => {
    setCliente(normalize(clienteInicial));
  }, [clienteInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const base = {
        nombre: cliente.nombre?.trim(),
        genero: cliente.genero?.trim(),
        edad: cliente.edad === "" ? undefined : Number(cliente.edad),
        identificacion: cliente.identificacion?.trim(),
        direccion: cliente.direccion?.trim(),
        telefono: cliente.telefono?.trim(),
        estado: Boolean(cliente.estado),
        contrasena: (cliente.contrasena ?? "").trim(),
      };

      if (!editando) {
        if (!base.nombre) throw new Error("Nombre es obligatorio");
        if (!base.genero) throw new Error("Género es obligatorio");
        if (base.edad === undefined || Number.isNaN(base.edad)) throw new Error("Edad inválida");
        if (!base.identificacion) throw new Error("Identificación es obligatoria");
        if (!base.direccion) throw new Error("Dirección es obligatoria");
        if (!base.telefono) throw new Error("Teléfono es obligatorio");
        if (!base.contrasena) throw new Error("La contraseña es obligatoria");

        await crearCliente(base);
      } else {

        const payload = clean({
          ...base,
          contrasena: base.contrasena ? base.contrasena : undefined,
        });

        if (Object.keys(payload).length === 0) {
          onCancel?.();
          return;
        }

        await actualizarCliente(clienteInicial.id, payload);
      }

      onSaved?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="form-title">{editando ? "Editar Cliente" : "Nuevo Cliente"}</div>

      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Nombre</label>
            <input name="nombre" value={cliente.nombre} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Género</label>
            <select name="genero" value={cliente.genero} onChange={handleChange} required>
              <option value="">Seleccione</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <div className="form-field">
            <label>Edad</label>
            <input name="edad" type="number" value={cliente.edad} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Identificación</label>
            <input name="identificacion" value={cliente.identificacion} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Dirección</label>
            <input name="direccion" value={cliente.direccion} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Teléfono</label>
            <input name="telefono" value={cliente.telefono} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label>Contraseña</label>
            <input
              name="contrasena"
              type="password"
              value={cliente.contrasena}
              onChange={handleChange}
              required={!editando}
              placeholder={editando ? "Dejar en blanco para no cambiar" : "Ingrese una contraseña"}
              autoComplete="new-password"
            />
          </div>

          <div className="form-field">
            <label>Estado</label>
            <div className="check-row">
              <input
                type="checkbox"
                name="estado"
                checked={!!cliente.estado}
                onChange={handleChange}
              />
              <span>{cliente.estado ? "Activo" : "Inactivo"}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editando ? "Actualizar" : "Crear"}
          </button>

          <button className="btn-secondary" type="button" onClick={() => onCancel?.()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
