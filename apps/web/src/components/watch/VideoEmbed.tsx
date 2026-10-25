"use client";

import { useEffect, useMemo, useState } from "react";

import { parseVideoUrl, youtubeEmbedSrc } from "@/lib/embed";

type VideoEmbedProps = {
  url: string | null;
  title: string;
  eager?: boolean;
  /** Prefer starting after a click (unmuted). If true, still show Play until user starts. */
  autoplay?: boolean;
};

/**
 * Lesson player: poster + Play façade, then embed. Click starts playback with a
 * user gesture (works better than silent autoplay; avoids a dead black frame).
 */
export function VideoEmbed({ url, title, eager, autoplay = false }: VideoEmbedProps) {
  const parsed = parseVideoUrl(url);
  const [origin, setOrigin] = useState("");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Reset when the lesson URL changes
  useEffect(() => {
    setPlaying(false);
    setFailed(false);
  }, [url]);

  const startPlayback = () => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    setPlaying(true);
  };

  const iframeSrc = useMemo(() => {
    const resolvedOrigin =
      origin || (typeof window !== "undefined" ? window.location.origin : "");
    if (!parsed?.youtubeId) {
      if (!parsed?.embedSrc) return null;
      try {
        const u = new URL(parsed.embedSrc);
        u.searchParams.set("autoplay", "1");
        u.searchParams.set("mute", "0");
        u.searchParams.set("muted", "0");
        return u.toString();
      } catch {
        return parsed.embedSrc;
      }
    }
    return youtubeEmbedSrc(parsed.youtubeId, {
      autoplay: true,
      muted: false,
      origin: resolvedOrigin || undefined,
    });
  }, [parsed, origin]);

  if (!parsed) {
    return (
      <div className="flex aspect-video items-end bg-sife-lime p-8 text-sife-black">
        <p className="max-w-md text-sm font-semibold uppercase tracking-[0.18em]">
          Add a video URL in Admin → Courses → Modules
        </p>
      </div>
    );
  }

  if (parsed.fileSrc) {
    return (
      <div className="sife-embed">
        <video
          key={parsed.fileSrc}
          controls
          playsInline
          autoPlay={autoplay || playing}
          muted={false}
          preload={eager ? "auto" : "metadata"}
          title={title}
          className="absolute inset-0 h-full w-full bg-black object-contain"
        >
          <source src={parsed.fileSrc} />
        </video>
      </div>
    );
  }

  if (!iframeSrc) {
    return (
      <a
        href={parsed.externalUrl}
        target="_blank"
        rel="noopener"
        className="relative flex aspect-video flex-col items-center justify-center overflow-hidden bg-sife-navy px-6 text-center text-sife-white"
      >
        {parsed.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={parsed.posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        ) : null}
        <span className="relative z-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
            {parsed.hostLabel}
          </p>
          <p className="mt-3 text-lg font-semibold uppercase tracking-[-0.03em]">{title}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            Open video ↗
          </p>
        </span>
      </a>
    );
  }

  return (
    <div className="sife-embed">
      {parsed.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={parsed.posterUrl}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            playing && !failed ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-sife-navy" aria-hidden />
      )}

      {!playing && !failed ? (
        <button
          type="button"
          onClick={startPlayback}
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-sife-true-black/35 text-sife-white transition-colors hover:bg-sife-true-black/45"
          aria-label={`Play ${title}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sife-coral text-sife-white shadow-lg ring-4 ring-sife-white/25 transition-transform hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
          <span className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.2em]">Play lesson</span>
        </button>
      ) : null}

      {playing && !failed ? (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 z-[1] h-full w-full border-0"
          onError={() => setFailed(true)}
        />
      ) : null}

      {failed ? (
        <a
          href={parsed.externalUrl}
          target="_blank"
          rel="noopener"
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-sife-true-black/70 px-6 text-center text-sife-white"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
            Player blocked here
          </p>
          <p className="mt-3 text-sm text-sife-white/80">Watch on {parsed.hostLabel} instead</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            Open video ↗
          </p>
        </a>
      ) : null}
    </div>
  );
}
