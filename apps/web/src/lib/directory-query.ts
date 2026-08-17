export type DirectoryTag = {
  id: number;
  name: string;
  slug: string;
  group: "community" | "access" | "focus";
};

export type DirectoryFilters = {
  q: string;
  tags: string[];
  city: string;
  country: string;
  region: string;
};

export function parseDirectoryFilters(
  params: Record<string, string | string[] | undefined>,
): DirectoryFilters {
  return {
    q: first(params.q).trim(),
    tags: list(params.tag),
    city: first(params.city).trim(),
    country: first(params.country).trim(),
    region: first(params.region).trim(),
  };
}

export function directoryHref(filters: DirectoryFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  for (const tag of filters.tags) params.append("tag", tag);
  if (filters.city) params.set("city", filters.city);
  if (filters.country) params.set("country", filters.country);
  if (filters.region) params.set("region", filters.region);
  const query = params.toString();
  return query ? `/database?${query}` : "/database";
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => item.trim()).filter(Boolean);
}
