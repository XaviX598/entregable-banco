export function descargarPdfDesdeBase64(base64, filename = "estado-cuenta.pdf") {
  const clean = base64.includes(",") ? base64.split(",")[1] : base64;

  const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
