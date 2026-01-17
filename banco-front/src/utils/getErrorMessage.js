export function getErrorMessage(err) {
  if (!err) return "Ocurrió un error desconocido.";

  if (typeof err === "string") return err;

  const axiosMsg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data?.detalle;

  if (axiosMsg) return axiosMsg;

  const fetchMsg =
    err?.data?.message ||
    err?.data?.error ||
    err?.body?.message ||
    err?.body?.error;

  if (fetchMsg) return fetchMsg;

  if (err?.message) return err.message;

  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return "Ocurrió un error al procesar la respuesta.";
  }
}
