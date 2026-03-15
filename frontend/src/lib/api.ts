const resolveBackendBaseUrl = (): string => {
  const configured = import.meta.env.NEXT_PUBLIC_API_URL?.trim();
  const fallback = "http://localhost:3000";
  const baseUrl = configured || fallback;

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export const BACKEND_BASE_URL = resolveBackendBaseUrl();

export const backendApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${normalizedPath}`;
};

export const resolveBackendAssetUrl = (assetUrl: string): string => {
  if (!assetUrl) return assetUrl;

  const trimmed = assetUrl.trim();

  // Keep non-HTTP URLs untouched.
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Relative paths from Payload should be served by the backend.
  if (trimmed.startsWith("/")) {
    return `${BACKEND_BASE_URL}${trimmed}`;
  }

  try {
    const parsedUrl = new URL(trimmed);
    const backendUrl = new URL(BACKEND_BASE_URL);
    const isLocalhostSource =
      parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";
    const backendIsRemote =
      backendUrl.hostname !== "localhost" && backendUrl.hostname !== "127.0.0.1";

    if (isLocalhostSource && backendIsRemote) {
      return `${backendUrl.origin}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }

    return trimmed;
  } catch {
    return `${BACKEND_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  }
};
