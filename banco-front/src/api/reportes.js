import { httpGet } from "../utils/http";

export const obtenerEstadoCuenta = ({ clienteId, fechaInicio, fechaFin }) => {
  const qs = new URLSearchParams({ clienteId, fechaInicio, fechaFin });
  return httpGet(`/api/reportes/estado-cuenta?${qs.toString()}`);
};

export const obtenerEstadoCuentaPdf = async ({ clienteId, fechaInicio, fechaFin }) => {
  const qs = new URLSearchParams({ clienteId, fechaInicio, fechaFin });

  const res = await fetch(
    `/api/reportes/estado-cuenta.pdf?${qs.toString()}`,
    { headers: { Accept: "application/pdf" } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.blob();
};
