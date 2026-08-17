export function embedSrc(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes("player.vimeo.com/video/") || trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }

  const youtube = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtube?.[1]) return `https://www.youtube.com/embed/${youtube[1]}`;

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}
