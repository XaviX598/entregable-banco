import { useState } from "react";
import "./styles/app.css";
import Shell from "./components/Shell";

import ClientesPage from "./pages/ClientesPage";
import CuentasPage from "./pages/CuentasPage";
import MovimientosPage from "./pages/MovimientosPage";
import ReportesPage from "./pages/ReportesPage";
import Footer from "./components/Footer";

export default function App() {
  const [active, setActive] = useState("Clientes");

  const renderPage = () => {
    switch (active) {
      case "Clientes":
        return <ClientesPage />;
      case "Cuentas":
        return <CuentasPage />;
      case "Movimientos":
        return <MovimientosPage />;
      case "Reportes":
        return <ReportesPage />;
      default:
        return <ClientesPage />;
    }
  };

  return (
    <div className="app-layout">
      <Shell active={active} onNavigate={setActive}>
        <main className="app-content">
          {renderPage()}
        </main>
      </Shell>

      <Footer />
    </div>
  );
}
