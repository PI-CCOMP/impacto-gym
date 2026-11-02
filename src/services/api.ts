const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
let sessionExpired = false;

type ApiErrorPayload = {
  erro?: string;
  codigo?: string;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function guardarTokens(accessToken: string, refreshToken: string): void {
  sessionStorage.setItem("access_token", accessToken);
  sessionStorage.setItem("refresh_token", refreshToken);
}

function limparSessao(): void {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("perfil");
}

function expirarSessao(): void {
  if (sessionExpired) return;
  const perfil = sessionStorage.getItem("perfil");
  limparSessao();
  sessionExpired = true;
  window.dispatchEvent(
    new CustomEvent("auth:session-expired", { detail: { perfil } }),
  );
}

async function renovarAccessToken(): Promise<string | null> {
  const refreshToken = sessionStorage.getItem("refresh_token");
  if (!refreshToken) {
    expirarSessao();
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    expirarSessao();
    return null;
  }

  const result = (await response.json()) as {
    access_token: string;
    refresh_token: string;
  };
  guardarTokens(result.access_token, result.refresh_token);
  sessionExpired = false;
  return result.access_token;
}

async function lerErro(response: Response): Promise<ApiError> {
  let payload: ApiErrorPayload = {};
  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    // Error responses without JSON use the standard message below.
  }
  return new ApiError(
    payload.erro ?? "Não foi possível concluir a solicitação.",
    response.status,
    payload.codigo,
  );
}

async function apiRequest<T>(
  path: string,
  init: RequestInit,
  authenticated = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = authenticated ? sessionStorage.getItem("access_token") : null;
  if (authenticated && !token) {
    expirarSessao();
    throw new ApiError("Sua sessão expirou. Entre novamente.", 401);
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
  if (response.status === 401 && authenticated && path !== "/auth/refresh") {
    const refreshedToken = await renovarAccessToken();
    if (refreshedToken) {
      headers.set("Authorization", `Bearer ${refreshedToken}`);
      response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
      if (response.status === 401) expirarSessao();
    }
  }
  if (!response.ok) throw await lerErro(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" }, true);
}

export async function apiGetAllPages<T>(path: string): Promise<T[]> {
  const [pathname, query = ""] = path.split("?", 2);
  const params = new URLSearchParams(query);
  params.set("pagina", "1");
  params.set("por_pagina", "50");

  const firstPage = await apiGet<{
    dados: T[];
    total: number;
    por_pagina: number;
  }>(`${pathname}?${params}`);
  const results = [...firstPage.dados];
  const totalPages = Math.ceil(firstPage.total / firstPage.por_pagina);

  for (let page = 2; page <= totalPages; page += 1) {
    params.set("pagina", String(page));
    const result = await apiGet<{ dados: T[] }>(`${pathname}?${params}`);
    results.push(...result.dados);
  }

  return results;
}

export function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    false,
  );
}

export function apiPostAuthed<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    true,
  );
}

export function apiPatchAuthed<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    true,
  );
}

export function apiPutAuthed<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    true,
  );
}

export function apiDeleteAuthed<T = void>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" }, true);
}

export function apiUploadAuthed<T>(
  path: string,
  file: File,
  fieldName: string,
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  return apiRequest<T>(path, { method: "PATCH", body: formData }, true);
}

export async function apiGetBlob(path: string): Promise<Blob> {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    expirarSessao();
    throw new ApiError("Sua sessão expirou. Entre novamente.", 401);
  }
  let response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) {
    const refreshedToken = await renovarAccessToken();
    if (refreshedToken) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { Authorization: `Bearer ${refreshedToken}` },
      });
    }
  }
  if (response.status === 401) expirarSessao();
  if (!response.ok) throw await lerErro(response);
  return response.blob();
}

const exerciseMediaCache = new Map<string, string>();

export async function midiaExercicioPrivadaPorUrl(
  mediaUrl: string | null,
): Promise<string | null> {
  if (!mediaUrl) return null;
  const parsedUrl = new URL(mediaUrl, API_BASE_URL);
  const apiOrigin = new URL(API_BASE_URL).origin;
  const match = parsedUrl.pathname.match(
    /^\/exercicios\/\d+\/midia\/(?:foto|video|ativacao)$/,
  );
  if (!match || parsedUrl.origin !== apiOrigin) return mediaUrl;

  const path = `${parsedUrl.pathname}${parsedUrl.search}`;
  const cachedUrl = exerciseMediaCache.get(path);
  if (cachedUrl) return cachedUrl;
  const blob = await apiGetBlob(path);
  const objectUrl = URL.createObjectURL(blob);
  exerciseMediaCache.set(path, objectUrl);
  return objectUrl;
}

const profilePhotoCache = new Map<number, string>();

export async function fotoPerfilPrivada(idUsuario: number): Promise<string> {
  const cachedUrl = profilePhotoCache.get(idUsuario);
  if (cachedUrl) return cachedUrl;
  const blob = await apiGetBlob(`/usuarios/fotos/${idUsuario}`);
  const objectUrl = URL.createObjectURL(blob);
  profilePhotoCache.set(idUsuario, objectUrl);
  return objectUrl;
}

export async function fotoPerfilPrivadaPorUrl(
  fotoUrl: string | null,
): Promise<string | null> {
  if (!fotoUrl) return null;
  const parsedUrl = new URL(fotoUrl, API_BASE_URL);
  const match = parsedUrl.pathname.match(/^\/usuarios\/fotos\/(\d+)$/);
  if (!match) {
    throw new ApiError("A API retornou um endereço de foto inválido.", 502);
  }
  return fotoPerfilPrivada(Number(match[1]));
}

export function invalidarFotoPerfil(idUsuario: number): void {
  const cachedUrl = profilePhotoCache.get(idUsuario);
  if (cachedUrl) URL.revokeObjectURL(cachedUrl);
  profilePhotoCache.delete(idUsuario);
}

export async function apiPostPdf<T>(
  path: string,
  token: string,
  arquivo: File,
): Promise<T> {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw await lerErro(response);
  return (await response.json()) as T;
}

export function guardarSessao(
  accessToken: string,
  refreshToken: string,
  perfil?: string,
): void {
  sessionExpired = false;
  guardarTokens(accessToken, refreshToken);
  if (perfil) sessionStorage.setItem("perfil", perfil);
}

export function encerrarSessaoLocal(): void {
  limparSessao();
}

export function getPerfil(): string | null {
  return sessionStorage.getItem("perfil");
}

export function rotaPorPerfil(perfil: string): string {
  if (perfil === "aluno") return "/inicio";
  if (perfil === "instrutor") return "/dashboard/treinos";
  if (perfil === "recepcionista") return "/dashboard/avisos";
  return "/dashboard/usuarios";
}
