import { useEffect, useMemo, useState } from "react";

import { listarClientes } from "../api/clientes";
import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import Modal from "../components/Modal";
import { getErrorMessage } from "../utils/getErrorMessage";
import { normalizeClienteForForm } from "../utils/normalizeCliente";


export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [q, setQ] = useState("");

  const [alert, setAlert] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const showError = (err) => {
    setAlert({ type: "error", message: getErrorMessage(err) });
  };

  const showSuccess = (msg) => {
    setAlert({ type: "success", message: msg });
    setTimeout(() => setAlert(null), 2500);
  };

  const cargar = async () => {
    setAlert(null);
    try {
      const data = await listarClientes();
      setClientes(data);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clientes;
    return clientes.filter(
      (c) =>
        (c.nombre ?? "").toLowerCase().includes(s) ||
        (c.identificacion ?? "").toLowerCase().includes(s)
    );
  }, [clientes, q]);

  const onEdit = (c) => {
    setClienteEditando(normalizeClienteForForm(c));
    setShowForm(true);
  };

  const onNuevo = () => {
    setClienteEditando(null);
    setShowForm(true);
  };

  const onSaved = () => {
    setShowForm(false);
    setClienteEditando(null);
    showSuccess("Cliente guardado correctamente.");
    cargar();
  };

  return (
    <>
      <div className="page-title">Clientes</div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-new" onClick={onNuevo}>
          Nuevo
        </button>
      </div>

      {alert && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            margin: "10px 0",
            border: "1px solid #e5e7eb",
            background: alert.type === "error" ? "#fee2e2" : "#dcfce7",
            color: "#111827",
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div style={{ whiteSpace: "pre-wrap" }}>{alert.message}</div>
          <button
            onClick={() => setAlert(null)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      <div className="panel">
        <ClienteList
          clientes={clientesFiltrados}
          onEdit={onEdit}
          onRefresh={cargar}
          tableMode
        />
      </div>

      {showForm && (
        <Modal
          title={clienteEditando?.id ? "Editar Cliente" : "Nuevo Cliente"}
          onClose={() => {
            setShowForm(false);
            setClienteEditando(null);
          }}
        >
          <ClienteForm
            key={clienteEditando?.id ?? "new"}
            clienteInicial={clienteEditando}
            onSaved={onSaved}
            onCancel={() => {
              setShowForm(false);
              setClienteEditando(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}