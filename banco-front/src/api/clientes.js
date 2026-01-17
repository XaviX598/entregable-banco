import { httpGet, httpPost, httpPut, httpDelete } from "../utils/http";

export const listarClientes = () =>
  httpGet("/api/clientes");

export const crearCliente = (cliente) =>
  httpPost("/api/clientes", cliente);

export const actualizarCliente = (id, cliente) =>
  httpPut(`/api/clientes/${id}`, cliente);

export const eliminarCliente = (id) =>
  httpDelete(`/api/clientes/${id}`);