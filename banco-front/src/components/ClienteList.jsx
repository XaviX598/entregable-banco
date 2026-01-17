import { eliminarCliente } from "../api/clientes";

export default function ClienteList({ clientes, onEdit, onRefresh, tableMode }) {
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    try {
      await eliminarCliente(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!tableMode) {
    return (
      <ul>
        {clientes.map((c) => (
          <li key={c.id}>
            {c.nombre} - {c.identificacion}
            <button onClick={() => onEdit(c)}>Editar</button>
            <button onClick={() => eliminar(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Identificación</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th style={{ width: 220 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((c) => (
          <tr key={c.id}>
            <td>{c.nombre}</td>
            <td>{c.identificacion}</td>
            <td>{c.telefono}</td>
            <td>{c.estado ? "Activo" : "Inactivo"}</td>
            <td className="actions">
              <button onClick={() => onEdit(c)}>Editar</button>
              <button className="btn-danger" onClick={() => eliminar(c.id)}>Eliminar</button>

            </td>
          </tr>
        ))}

        {clientes.length === 0 && (
          <>
            { }
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td>&nbsp;</td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}
