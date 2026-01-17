import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import { listarClientes } from "../api/clientes";
import { listarCuentasPorCliente } from "../api/cuentas";
import {
  crearMovimiento,
  listarMovimientosPorCuenta,
  eliminarMovimiento,
  actualizarMovimiento,
} from "../api/movimientos";
import MovimientosForm from "../components/MovimientosForm";
import MovimientosList from "../components/MovimientosList";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function MovimientosPage() {
  const [clientes, setClientes] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [cuentaId, setCuentaId] = useState("");

  const [error, setError] = useState("");

  // ✅ modal como en CuentasPage
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((e) => setError(getErrorMessage(e)));
  }, []);

  useEffect(() => {
    if (!clienteId) return;
    listarCuentasPorCliente(clienteId)
      .then(setCuentas)
      .catch((e) => setError(getErrorMessage(e)));
  }, [clienteId]);

  useEffect(() => {
    if (!cuentaId) return;
    listarMovimientosPorCuenta(cuentaId)
      .then(setMovimientos)
      .catch((e) => setError(getErrorMessage(e)));
  }, [cuentaId]);

  const cuentaSeleccionada = useMemo(
    () => cuentas.find((c) => String(c.id) === String(cuentaId)),
    [cuentas, cuentaId]
  );

  const refreshMovs = async () => {
    if (!cuentaId) return;
    try {
      const data = await listarMovimientosPorCuenta(cuentaId);
      setMovimientos(data);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  // ✅ abrir/cerrar igual que tu ejemplo
  const abrirNuevo = () => {
    if (!cuentaId) {
      alert("Selecciona una cuenta primero");
      return;
    }
    setError("");
    setEditando(null);
    setShowModal(true);
  };

  const abrirEditar = (mov) => {
    setError("");
    setEditando(mov);
    setShowModal(true);
  };

  const cerrar = () => {
    setShowModal(false);
    setEditando(null);
  };

  const onSaved = () => {
    cerrar();
    refreshMovs();
  };

  const onSubmitMovimiento = async ({ valor }) => {
    const v = Number(valor);
    if (Number.isNaN(v) || v === 0) throw new Error("El valor del movimiento no puede ser 0");

    if (editando?.id) {
      await actualizarMovimiento(editando.id, { valor: v });
    } else {
      await crearMovimiento({ cuentaId: Number(cuentaId), valor: v });
    }

    onSaved();
  };

  const onEliminar = async (id) => {
    if (!confirm("¿Eliminar movimiento?")) return;
    try {
      await eliminarMovimiento(id);
      refreshMovs();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <>
      <div className="page-title">Movimientos</div>

      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <div className="toolbar" style={{ gap: 12 }}>
        <select
          className="search"
          value={clienteId}
          onChange={(e) => {
            const id = e.target.value;
            setError("");
            setClienteId(id);
            setCuentaId("");
            setCuentas([]);
            setMovimientos([]);
          }}
        >
          <option value="">Seleccione cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} - {c.identificacion}
            </option>
          ))}
        </select>

        <select
          className="search"
          value={cuentaId}
          onChange={(e) => {
            const id = e.target.value;
            setError("");
            setCuentaId(id);
            setMovimientos([]);
          }}
          disabled={!clienteId}
        >
          <option value="">Seleccione cuenta...</option>
          {cuentas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.numeroCuenta} ({c.tipoCuenta})
            </option>
          ))}
        </select>

        <button className="btn-new" onClick={abrirNuevo} disabled={!cuentaId}>
          Nuevo
        </button>
      </div>

      <div className="panel">
        <MovimientosList
          movimientos={movimientos}
          cuenta={cuentaSeleccionada}
          onDelete={onEliminar}
          onEdit={abrirEditar}
        />
      </div>

      {showModal && (
        <Modal title={editando?.id ? "Editar Movimiento" : "Registrar Movimiento"} onClose={cerrar}>
          <MovimientosForm
            key={editando?.id ?? "new"}
            movimientoInicial={editando}
            onSubmit={onSubmitMovimiento}
            onCancel={cerrar}
          />
        </Modal>
      )}
    </>
  );
}
