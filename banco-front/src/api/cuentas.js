import { httpGet, httpPost, httpPut, httpDelete } from "../utils/http";

export const listarCuentasPorCliente = (clienteId) =>
  httpGet(`/api/cuentas/cliente/${clienteId}`);

export const crearCuenta = (cuenta) =>
  httpPost("/api/cuentas", cuenta);

export const actualizarCuenta = (id, cuenta) =>
  httpPut(`/api/cuentas/${id}`, cuenta);

export const eliminarCuenta = (id) =>
  httpDelete(`/api/cuentas/${id}`);
