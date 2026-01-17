import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import CuentaForm from "../components/CuentaForm";
import CuentaList from "../components/CuentaList";
import { listarClientes } from "../api/clientes";
import { listarCuentasPorCliente } from "../api/cuentas";

export default function CuentasPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [cuentas, setCuentas] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargarClientes = () => {
    listarClientes().then(setClientes).catch((e) => setError(e.message));
  };

  const cargarCuentas = async () => {
    setError("");
    if (!clienteId) return setCuentas([]);

    try {
      const data = await listarCuentasPorCliente(clienteId);
      setCuentas(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError("");

      if (!clienteId) {
        setCuentas([]);
        return;
      }

      try {
        const data = await listarCuentasPorCliente(clienteId);
        if (!cancelled) setCuentas(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [clienteId]);



  const cuentasFiltradas = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    if (!q) return cuentas;
    return cuentas.filter(
      (c) =>
        (c.numeroCuenta ?? "").toLowerCase().includes(q) ||
        (c.tipoCuenta ?? "").toLowerCase().includes(q)
    );
  }, [cuentas, buscar]);

  const abrirNuevo = () => {
    if (!clienteId) {
      alert("Selecciona un cliente primero");
      return;
    }
    setEditando(null);
    setShowModal(true);
  };

  const abrirEditar = (cuenta) => {
    setEditando(cuenta);
    setShowModal(true);
  };

  const cerrar = () => {
    setShowModal(false);
    setEditando(null);
  };

  const onSaved = () => {
    cerrar();
    cargarCuentas();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Cuentas</h2>

        <div className="page-actions">
          <select
            className="search"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">-- Selecciona cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.identificacion})
              </option>
            ))}
          </select>


          <input
            className="search"
            placeholder="Buscar"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />

          <button className="btn-new" onClick={abrirNuevo}>
            Nuevo
          </button>
        </div>
      </div>

      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <CuentaList cuentas={cuentasFiltradas} onEdit={abrirEditar} onRefresh={cargarCuentas} />

      {showModal && (
        <Modal title={editando?.id ? "Editar Cuenta" : "Nueva Cuenta"} onClose={cerrar}>
          <CuentaForm
            key={editando?.id ?? "new"}
            cuentaInicial={editando}
            clienteId={Number(clienteId)}
            onSaved={onSaved}
            onCancel={cerrar}
          />
        </Modal>
      )}
    </div>
  );
}
