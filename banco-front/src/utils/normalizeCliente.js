export function normalizeClienteForForm(c) {
  return {
    id: c?.id ?? null,
    nombre: c?.nombre ?? "",
    genero: c?.genero ?? "",
    edad: c?.edad ?? "",
    identificacion: c?.identificacion ?? "",
    direccion: c?.direccion ?? "",
    telefono: c?.telefono ?? "",
  };
}