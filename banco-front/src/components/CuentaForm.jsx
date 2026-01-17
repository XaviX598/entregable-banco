import { useEffect, useState } from "react";
import { actualizarCuenta, crearCuenta } from "../api/cuentas";
import { listarClientes } from "../api/clientes";

const empty = {
  numeroCuenta: "",
  tipoCuenta: "Ahorros",
  saldoInicial: 0,
  saldoActual: 0,
  estado: true,
  cliente: { id: null },
};

export default function CuentaForm({ cuentaInicial, clienteId, onSaved, onCancel }) {
  const editando = Boolean(cuentaInicial?.id);

  const [cuenta, setCuenta] = useState(
    cuentaInicial
      ? {
        ...cuentaInicial,
        cliente: { id: cuentaInicial.cliente?.id ?? clienteId ?? null },
      }
      : { ...empty, cliente: { id: clienteId ?? null } }
  );

  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((e) => setError(e.message));
  }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;

    setCuenta((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "saldoInicial" || name === "saldoActual"
            ? Number(value)
            : value,
    }));
  };

  const changeCliente = (e) => {
    const id = e.target.value ? Number(e.target.value) : null;
    setCuenta((prev) => ({ ...prev, cliente: { id } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const cid = cuenta.cliente?.id ?? clienteId;
      if (!cid) throw new Error("Debes seleccionar un cliente");

      const payload = {
        numeroCuenta: cuenta.numeroCuenta,
        tipoCuenta: cuenta.tipoCuenta,
        estado: Boolean(cuenta.estado),
        cliente: { id: Number(cid) },
      };

      if (!editando) {
        const saldoInicial = Number(cuenta.saldoInicial);
        if (Number.isNaN(saldoInicial)) throw new Error("Saldo inicial inválido");

        payload.saldoInicial = saldoInicial;
        payload.saldoActual = saldoInicial;

        await crearCuenta(payload);
      } else {
        await actualizarCuenta(cuentaInicial.id, payload);
      }

      onSaved?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Cliente</label>
            <select
              value={cuenta.cliente?.id ?? ""}
              onChange={changeCliente}
              required
              disabled={editando}
            >
              <option value="">Seleccione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} - {c.identificacion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Número de cuenta</label>
            <input name="numeroCuenta" value={cuenta.numeroCuenta} onChange={change} required />
          </div>

          <div className="form-field">
            <label>Tipo</label>
            <select name="tipoCuenta" value={cuenta.tipoCuenta} onChange={change} required>
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>
          </div>

          <div className="form-field">
            <label>Saldo Inicial</label>
            <input
              name="saldoInicial"
              type="number"
              step="0.01"
              value={cuenta.saldoInicial}
              onChange={change}
              required
              disabled={editando}
            />
          </div>

          {editando && (
            <div className="form-field">
              <label>Saldo Actual</label>
              <input name="saldoActual" type="number" step="0.01" value={cuenta.saldoActual} disabled />
            </div>
          )}

          <div className="form-field">
            <label>Estado</label>
            <div className="check-row">
              <input type="checkbox" name="estado" checked={!!cuenta.estado} onChange={change} />
              <span>{cuenta.estado ? "Activo" : "Inactivo"}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editando ? "Actualizar" : "Crear"}
          </button>
          <button className="btn-secondary" type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
