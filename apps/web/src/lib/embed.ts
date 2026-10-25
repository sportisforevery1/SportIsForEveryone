export type EmbedKind = "youtube" | "vimeo" | "loom" | "file" | "other" | "link";

export type ParsedVideo = {
  embedSrc: string | null;
  fileSrc: string | null;
  kind: EmbedKind;
  externalUrl: string;
  hostLabel: string;
  /** YouTube poster — fills the frame so we never show an empty black void */
  posterUrl: string | null;
  youtubeId: string | null;
};

function hostLabel(hostname: string): string {
  const host = hostname.replace(/^www\./, "");
  if (host.includes("youtu")) return "YouTube";
  if (host.includes("vimeo")) return "Vimeo";
  if (host.includes("loom")) return "Loom";
  if (host.includes("dailymotion")) return "Dailymotion";
  return host;
}

export function youtubePoster(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedSrc(
  id: string,
  options: { autoplay?: boolean; muted?: boolean; origin?: string } = {},
): string {
  const autoplay = Boolean(options.autoplay);
  // Unmuted autoplay only works after a user gesture (our Play click).
  const muted = options.muted ?? autoplay;
  const params = new URLSearchParams({
    controls: "1",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    fs: "1",
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
  });
  if (options.origin) params.set("origin", options.origin);
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function fromYoutubeId(id: string, externalUrl?: string): ParsedVideo {
  return {
    embedSrc: youtubeEmbedSrc(id),
    fileSrc: null,
    kind: "youtube",
    externalUrl: externalUrl || `https://www.youtube.com/watch?v=${id}`,
    hostLabel: "YouTube",
    posterUrl: youtubePoster(id),
    youtubeId: id,
  };
}

export function parseVideoUrl(url: string | null | undefined): ParsedVideo | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const externalUrl = parsed.toString();
  const label = hostLabel(parsed.hostname);
  const path = parsed.pathname.toLowerCase();

  if (/\.(mp4|webm|ogg|m4v)(\?|$)/i.test(path)) {
    return {
      embedSrc: null,
      fileSrc: externalUrl,
      kind: "file",
      externalUrl,
      hostLabel: "Video",
      posterUrl: null,
      youtubeId: null,
    };
  }

  const existingYt = trimmed.match(
    /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([\w-]{6,})/,
  );
  if (existingYt?.[1]) return fromYoutubeId(existingYt[1]);

  if (trimmed.includes("player.vimeo.com/video/")) {
    return {
      embedSrc: trimmed,
      fileSrc: null,
      kind: "vimeo",
      externalUrl,
      hostLabel: "Vimeo",
      posterUrl: null,
      youtubeId: null,
    };
  }

  if (trimmed.includes("loom.com/embed/")) {
    return {
      embedSrc: trimmed,
      fileSrc: null,
      kind: "loom",
      externalUrl,
      hostLabel: "Loom",
      posterUrl: null,
      youtubeId: null,
    };
  }

  const yt = trimmed.match(
    /(?:youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{6,})/,
  );
  if (yt?.[1]) return fromYoutubeId(yt[1]);

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return {
      embedSrc: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1`,
      fileSrc: null,
      kind: "vimeo",
      externalUrl,
      hostLabel: "Vimeo",
      posterUrl: null,
      youtubeId: null,
    };
  }

  const loom = trimmed.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loom?.[1]) {
    return {
      embedSrc: `https://www.loom.com/embed/${loom[1]}?autoplay=1&muted=1`,
      fileSrc: null,
      kind: "loom",
      externalUrl,
      hostLabel: "Loom",
      posterUrl: null,
      youtubeId: null,
    };
  }

  return {
    embedSrc: null,
    fileSrc: null,
    kind: "link",
    externalUrl,
    hostLabel: label,
    posterUrl: null,
    youtubeId: null,
  };
}

export function embedSrc(url: string | null | undefined): string | null {
  return parseVideoUrl(url)?.embedSrc ?? null;
}
