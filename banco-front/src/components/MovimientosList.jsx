export default function MovimientoList({ movimientos, cuenta, onDelete, onEdit }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Saldo</th>
          <th style={{ width: 180 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((m) => (
          <tr key={m.id}>
            <td>{m.fecha ? new Date(m.fecha).toLocaleString() : "-"}</td>
            <td>{m.tipoMovimiento}</td>
            <td>{Number(m.valor).toFixed(2)}</td>
            <td>{Number(m.saldo).toFixed(2)}</td>
            <td className="actions" style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-secondary"
                onClick={() => onEdit?.(m)}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                onClick={() => onDelete(m.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}

        {movimientos.length === 0 && (
          <tr>
            <td colSpan={5} style={{ color: "#6b7280" }}>
              {!cuenta
                ? "Seleccione un cliente y una cuenta."
                : "No hay movimientos para esta cuenta."}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
