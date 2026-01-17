import { httpGet, httpPost,httpPut, httpDelete } from "../utils/http";

export const listarMovimientosPorCuenta = (cuentaId) =>
  httpGet(`/api/movimientos/cuenta/${cuentaId}`);

export const listarMovimientos = () =>
  httpGet("/api/movimientos");

export const crearMovimiento = ({ cuentaId, valor }) =>
  httpPost("/api/movimientos", {
    valor,
    cuenta: { id: cuentaId },
  });

  export const actualizarMovimiento = (id, { valor }) =>
    httpPut(`/api/movimientos/${id}`, { valor });

export const eliminarMovimiento = (id) =>
  httpDelete(`/api/movimientos/${id}`);
