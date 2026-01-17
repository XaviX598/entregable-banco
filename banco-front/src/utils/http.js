const BASE_URL = import.meta.env.VITE_API_URL || "";

async function readBody(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    return await res.text();
  } catch {
    return "";
  }
}

function buildError(method, url, res, data) {
  const msg =
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" && data) ||
    `${method} ${url} -> ${res.status}`;

  const err = new Error(msg);
  err.status = res.status;
  err.data = data;
  err.method = method;
  err.url = url;
  return err;
}

export async function httpGet(url) {
  const res = await fetch(BASE_URL + url);
  const data = await readBody(res);

  if (!res.ok) throw buildError("GET", url, res, data);

  return data; 
}

export async function httpPost(url, body) {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await readBody(res);

  if (!res.ok) throw buildError("POST", url, res, data);

  return data;
}

export async function httpPut(url, body) {
  const res = await fetch(BASE_URL + url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await readBody(res);

  if (!res.ok) throw buildError("PUT", url, res, data);

  return data;
}

export async function httpDelete(url) {
  const res = await fetch(BASE_URL + url, { method: "DELETE" });
  const data = await readBody(res);

  if (!res.ok) throw buildError("DELETE", url, res, data);

  return true;
}
