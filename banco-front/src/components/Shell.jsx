export default function Shell({ active, onNavigate, children }) {
  const items = ["Clientes", "Cuentas", "Movimientos", "Reportes"];

  return (
    <div className="app-shell">
      <div className="topbar">
        <span className="logo">🏦</span>
        <span>BANCO</span>
      </div>

      <div className="main">
        <aside className="sidebar">
          {items.map((it) => (
            <div
              key={it}
              className={`nav-item ${active === it ? "active" : ""}`}
              onClick={() => onNavigate(it)}
            >
              {it}
            </div>
          ))}
        </aside>

        <section className="content">{children}</section>
      </div>
    </div>
  );
}
