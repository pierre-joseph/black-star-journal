const resolveBackendBaseUrl = (): string => {
  const configured = import.meta.env.NEXT_PUBLIC_API_URL?.trim();
  const fallback = "http://localhost:3000";
  const baseUrl = configured || fallback;

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export const BACKEND_BASE_URL = resolveBackendBaseUrl();

const resolveR2BaseUrl = (): string => {
  const configured = import.meta.env.NEXT_PUBLIC_R2_URL?.trim();
  if (!configured) return "";
  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};

export const R2_BASE_URL = resolveR2BaseUrl();

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

type AssetLike =
  | string
  | {
      filename?: string | null;
      url?: string | null;
    }
  | null
  | undefined;

const normalizeAssetPath = (value: string): string => value.trim().replace(/^\/+/, "");

const isDirectUrl = (value: string): boolean =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

export const resolveR2AssetUrl = (asset: AssetLike): string | undefined => {
  if (!asset) return undefined;

  if (typeof asset === "string") {
    const trimmed = asset.trim();
    if (!trimmed) return undefined;
    if (isDirectUrl(trimmed)) return trimmed;
    if (!R2_BASE_URL) return trimmed;
    return `${R2_BASE_URL}/${normalizeAssetPath(trimmed)}`;
  }

  if (asset.filename) {
    if (!R2_BASE_URL) return asset.url?.trim() || undefined;
    return `${R2_BASE_URL}/${normalizeAssetPath(asset.filename)}`;
  }

  if (asset.url) {
    const trimmed = asset.url.trim();
    if (!trimmed) return undefined;
    if (isDirectUrl(trimmed)) return trimmed;
    if (!R2_BASE_URL) return trimmed;
    return `${R2_BASE_URL}/${normalizeAssetPath(trimmed)}`;
  }

  return undefined;
};
