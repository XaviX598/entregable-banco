import { eliminarCuenta } from "../api/cuentas";

export default function CuentaList({ cuentas, onEdit, onRefresh }) {
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar cuenta?")) return;
    try {
      await eliminarCuenta(id);
      onRefresh();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Tipo</th>
          <th>Saldo Inicial</th>
          <th>Saldo Actual</th>
          <th>Estado</th>
          <th style={{ width: 220 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cuentas.map((c) => (
          <tr key={c.id}>
            <td>{c.numeroCuenta}</td>
            <td>{c.tipoCuenta}</td>
            <td>{(c.saldoInicial ?? 0).toFixed(2)}</td>
            <td>{(c.saldoActual ?? 0).toFixed(2)}</td>

            <td>{c.estado ? "Activo" : "Inactivo"}</td>
            <td className="actions">
              <button onClick={() => onEdit(c)}>Editar</button>
              <button className="btn-danger" onClick={() => eliminar(c.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        {cuentas.length === 0 && (
          <tr>
            <td colSpan={6} style={{ color: "#6b7280" }}>
              No hay cuentas para este cliente
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
