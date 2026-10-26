async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
    if (body.detail?.message) return String(body.detail.message);
  } catch {
    /* ignore broken error bodies */
  }
  return response.statusText || "Request failed";
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<T>;
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return api<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
