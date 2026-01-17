import { useEffect, useMemo, useState } from "react";
import { listarClientes } from "../api/clientes";
import { obtenerEstadoCuenta, obtenerEstadoCuentaPdf } from "../api/reportes";




export default function ReportesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [estado, setEstado] = useState(null);
  const [pdfBase64, setPdfBase64] = useState("");

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((e) => setError(e.message));
  }, []);



  const consultar = async () => {
    setError("");
    setEstado(null);
    setPdfBase64("");

    if (!clienteId) return setError("Seleccione un cliente");
    if (!fechaInicio || !fechaFin) return setError("Seleccione fechaInicio y fechaFin");
    if (fechaFin < fechaInicio) return setError("fechaFin no puede ser menor que fechaInicio");

    setLoading(true);
    try {
      const data = await obtenerEstadoCuenta({ clienteId, fechaInicio, fechaFin });
      setEstado(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };


  const cuentas = estado?.cuentas ?? [];

  const movimientos = useMemo(() => {
    return (estado?.cuentas ?? []).flatMap((c) =>
      (c.movimientos ?? []).map((m) => ({
        ...m,
        numeroCuenta: c.numeroCuenta,
      }))
    );
  }, [estado]);


  const totales = useMemo(() => {
    let creditos = 0;
    let debitos = 0;

    for (const m of movimientos) {
      const v = Number(m.valor ?? m.movimiento ?? 0);
      if (v > 0) creditos += v;
      if (v < 0) debitos += Math.abs(v);
    }
    return { creditos, debitos };
  }, [movimientos]);

  const descargar = async () => {
    setError("");
    if (!clienteId) return setError("Seleccione un cliente");
    if (!fechaInicio || !fechaFin) return setError("Seleccione fechaInicio y fechaFin");
    if (fechaFin < fechaInicio) return setError("fechaFin no puede ser menor que fechaInicio");

    try {
      const blob = await obtenerEstadoCuentaPdf({ clienteId, fechaInicio, fechaFin });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estado-cuenta.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };




  return (
    <>
      <div className="page-title">Reportes</div>

      {error && <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</pre>}

      <div className="toolbar" style={{ gap: 12, alignItems: "center" }}>
        <select
          className="search"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccione cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} - {c.identificacion}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: "#111827" }}>Desde</span>
        <input
          className="search"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        <span style={{ fontSize: 13, color: "#111827" }}>Hasta</span>
        <input
          className="search"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />

        <button className="btn-new" onClick={consultar} disabled={loading}>
          {loading ? "Consultando..." : "Consultar"}
        </button>

        <button className="btn-secondary" onClick={descargar} disabled={!estado}>
          Descargar PDF
        </button>
      </div>

      <div className="panel">
        {!estado && (
          <div style={{ padding: 18, color: "#6b7280" }}>
            Seleccione cliente y fechas para generar el estado de cuenta.
          </div>
        )}

        {estado && (
          <>
            <h3 style={{ marginTop: 0 }}>Resumen</h3>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
              <div className="card-mini">
                <div className="label">Total créditos</div>
                <div className="value">
                  {Number(estado?.totalCreditos ?? totales.creditos ?? 0).toFixed(2)}
                </div>
              </div>
              <div className="card-mini">
                <div className="label">Total débitos</div>
                <div className="value">
                  {Number(estado?.totalDebitos ?? totales.debitos ?? 0).toFixed(2)}
                </div>
              </div>
            </div>

            <h3>Cuentas</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Saldo Inicial</th>
                  <th>Saldo Actual</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((c) => (
                  <tr key={c.cuentaId ?? c.numeroCuenta}>
                    <td>{c.numeroCuenta}</td>
                    <td>{c.tipoCuenta}</td>
                    <td>{Number(c.saldoInicial ?? 0).toFixed(2)}</td>
                    <td>{Number(c.saldoDisponible ?? 0).toFixed(2)}</td>
                    <td>{c.estado ? "Activo" : "Inactivo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: 18 }}>Movimientos</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Número Cuenta</th>
                  <th>Movimiento</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m, idx) => (
                  <tr key={m.id ?? idx}>
                    <td>{m.fecha ? new Date(m.fecha).toLocaleString() : "-"}</td>
                    <td>{m.numeroCuenta ?? m.cuenta?.numeroCuenta ?? "-"}</td>
                    <td>{Number(m.valor ?? m.movimiento ?? 0).toFixed(2)}</td>
                    <td>{Number(m.saldo ?? m.saldoDisponible ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
                {movimientos.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: "#6b7280" }}>
                      No hay movimientos en ese rango.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: "pointer" }}>Ver JSON</summary>
              <pre style={{ marginTop: 10, background: "#0b1220", color: "white", padding: 12, borderRadius: 8 }}>
                {JSON.stringify(estado, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </>
  );
}
