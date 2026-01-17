import { useState } from "react";

function initForm(mov) {
  if (mov?.id) {
    const v = Number(mov.valor ?? 0);
    return {
      tipo: v < 0 ? "RETIRO" : "DEPOSITO",
      monto: String(Math.abs(v)),
    };
  }
  return { tipo: "DEPOSITO", monto: "" };
}

export default function MovimientosForm({ movimientoInicial, onSubmit, onCancel }) {
  const editando = Boolean(movimientoInicial?.id);

  const [{ tipo, monto }, setForm] = useState(() => initForm(movimientoInicial));
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const n = Number(monto);
    if (Number.isNaN(n) || n <= 0) {
      setError("Monto debe ser mayor a 0");
      return;
    }

    const valor = tipo === "RETIRO" ? -Math.abs(n) : Math.abs(n);

    try {
      await onSubmit({ valor });
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <div className="form-grid">
        <div className="form-field">
          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="DEPOSITO">Depósito</option>
            <option value="RETIRO">Retiro</option>
          </select>
        </div>

        <div className="form-field">
          <label>Monto</label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" type="submit">
          {editando ? "Actualizar" : "Registrar"}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
