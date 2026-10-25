/** Default Bolting Blue chrome; `?surface=black` for cinematic black preview. */
export type HomeSurface = "navy" | "black";

export function parseHomeSurface(value: string | string[] | undefined): HomeSurface {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "black" ? "black" : "navy";
}
