"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { VideoEmbed } from "@/components/watch/VideoEmbed";
import { Link } from "@/i18n/navigation";
import type { CourseModuleImage, CourseModulePublic, CourseModuleVideo } from "@/lib/courses";
import { parseVideoUrl } from "@/lib/embed";

type NavModule = Pick<
  CourseModulePublic,
  "slug" | "title" | "locked" | "estimatedMinutes" | "hasVideo" | "hasImages"
>;

type LayoutMode = "split" | "video" | "notes";
type StageView = { kind: "video" } | { kind: "image"; index: number };

type CoursePlayerProps = {
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string;
  moduleTeaser: string;
  moduleIndex: number;
  moduleCount: number;
  estimatedMinutes: number | null;
  modules: NavModule[];
  currentSlug: string;
  prev: NavModule | null;
  next: NavModule | null;
  locked: boolean;
  hasVideo: boolean;
  videos: CourseModuleVideo[];
  images: CourseModuleImage[];
  notes: ReactNode;
};

const SPLIT_DEFAULT = 58;
const SPLIT_MIN = 34;
const SPLIT_MAX = 76;

export function CoursePlayer({
  courseTitle,
  courseSlug,
  moduleTitle,
  moduleTeaser,
  moduleIndex,
  moduleCount,
  estimatedMinutes,
  modules,
  currentSlug,
  prev,
  next,
  locked,
  hasVideo,
  videos,
  images,
  notes,
}: CoursePlayerProps) {
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("split");
  const [splitPct, setSplitPct] = useState(SPLIT_DEFAULT);
  const [stage, setStage] = useState<StageView>({ kind: "video" });
  const [isDesktop, setIsDesktop] = useState(false);
  const panelId = useId();
  const dragRef = useRef<{ startX: number; startPct: number } | null>(null);
  const splitPctRef = useRef(splitPct);
  const shellRef = useRef<HTMLDivElement>(null);
  const progress = Math.round(((moduleIndex + 1) / Math.max(moduleCount, 1)) * 100);

  useEffect(() => {
    splitPctRef.current = splitPct;
  }, [splitPct]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Keep sticky offsets accurate for site + course chrome (no scroll lock).
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const site =
        document.querySelector<HTMLElement>("header.sticky") ||
        document.querySelector<HTMLElement>("body header");
      const course = document.querySelector<HTMLElement>(".sife-course-chrome");
      if (site) root.style.setProperty("--sife-site-header", `${Math.round(site.getBoundingClientRect().height)}px`);
      if (course) {
        root.style.setProperty("--sife-course-header", `${Math.round(course.getBoundingClientRect().height)}px`);
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      root.style.removeProperty("--sife-site-header");
      root.style.removeProperty("--sife-course-header");
    };
  }, []);

  useEffect(() => {
    setChaptersOpen(false);
    setStage({ kind: "video" });
    setLayout("split");
  }, [currentSlug]);

  useEffect(() => {
    if (!chaptersOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChaptersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chaptersOpen]);

  const finishDrag = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    const pct = splitPctRef.current;
    if (pct >= 82) {
      setLayout("video");
      setSplitPct(SPLIT_DEFAULT);
      return;
    }
    if (pct <= 18) {
      setLayout("notes");
      setSplitPct(SPLIT_DEFAULT);
      return;
    }
    setSplitPct(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pct)));
  }, []);

  const onDragStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (layout !== "split") return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { startX: event.clientX, startPct: splitPctRef.current };
    },
    [layout],
  );

  const onDragMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current || !shellRef.current) return;
    const width = shellRef.current.getBoundingClientRect().width;
    if (width < 1) return;
    const delta = ((event.clientX - dragRef.current.startX) / width) * 100;
    const next = Math.min(92, Math.max(8, dragRef.current.startPct + delta));
    splitPctRef.current = next;
    setSplitPct(next);
  }, []);

  const onDragEnd = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
      finishDrag();
    },
    [finishDrag],
  );

  const onDividerDoubleClick = useCallback(() => {
    setLayout((prev) => (prev === "split" ? "video" : "split"));
    setSplitPct(SPLIT_DEFAULT);
  }, []);

  const openStill = (index: number) => {
    setStage({ kind: "image", index });
    if (layout === "notes") setLayout("split");
  };

  const primary = videos[0];
  const parsed = primary ? parseVideoUrl(primary.url) : null;
  const stageImage = stage.kind === "image" ? images[stage.index] ?? null : null;
  const imageIndex = stage.kind === "image" ? stage.index : 0;

  const showStage = layout !== "notes";
  const showNotes = layout !== "video";
  const shellStyle: CSSProperties =
    layout === "split"
      ? ({
          ["--sife-split-left" as string]: `${splitPct}fr`,
          ["--sife-split-right" as string]: `${100 - splitPct}fr`,
        } as CSSProperties)
      : { gridTemplateColumns: "1fr" };

  return (
    <div className="bg-sife-cream text-sife-ink">
      <header className="sife-course-chrome sticky top-[var(--sife-site-header)] z-40 border-b border-sife-white/10 bg-sife-navy text-sife-white">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 lg:px-8">
          <Link
            href={`/academy/${courseSlug}`}
            className="shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-sife-lime"
          >
            ← Course
          </Link>
          <div className="min-w-0 flex-1 basis-[9rem]">
            <p className="truncate text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-white/50">
              {courseTitle}
            </p>
            <p className="truncate text-sm font-semibold uppercase tracking-[-0.02em]">{moduleTitle}</p>
          </div>

          {/* Mobile / accessibility — desktop expand is the center drag divider */}
          <div
            className="flex items-center gap-0.5 border border-sife-white/20 bg-sife-true-black/30 p-0.5 lg:hidden"
            role="group"
            aria-label="Layout"
          >
            {(
              [
                ["video", "Video"],
                ["split", "Split"],
                ["notes", "Notes"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLayout(mode)}
                className={`px-2.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] ${
                  layout === mode
                    ? "bg-sife-lime text-sife-true-black"
                    : "text-sife-white/80 hover:bg-sife-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {isDesktop && layout !== "split" ? (
            <button
              type="button"
              onClick={() => {
                setLayout("split");
                setSplitPct(SPLIT_DEFAULT);
              }}
              className="hidden border border-sife-lime/50 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sife-lime hover:bg-sife-lime hover:text-sife-true-black lg:inline"
            >
              Show split
            </button>
          ) : null}

          <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sife-white/60 md:block">
            {moduleIndex + 1}/{moduleCount}
            {estimatedMinutes ? ` · ~${estimatedMinutes}m` : ""}
          </p>
          <button
            type="button"
            aria-expanded={chaptersOpen}
            aria-controls={panelId}
            onClick={() => setChaptersOpen((v) => !v)}
            className="shrink-0 border border-sife-lime/50 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-sife-lime hover:bg-sife-lime hover:text-sife-true-black"
          >
            {chaptersOpen ? "Hide" : "Chapters"}
          </button>
        </div>
        <div className="h-0.5 bg-sife-true-black/25" aria-hidden>
          <div className="h-full bg-sife-coral transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div id={panelId} hidden={!chaptersOpen} className="border-t border-sife-white/10">
          <ol className="mx-auto grid max-w-[96rem] sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod, i) => {
              const active = mod.slug === currentSlug;
              const href = `/academy/${courseSlug}/${mod.slug}`;
              const row = (
                <>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center text-[0.65rem] font-bold ${
                      active
                        ? "bg-sife-coral text-sife-white"
                        : mod.locked
                          ? "border border-sife-white/25 text-sife-white/40"
                          : "border border-sife-lime/40 text-sife-lime"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold uppercase tracking-[-0.02em]">
                      {mod.title}
                    </span>
                    <span className="mt-0.5 block text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-sife-white/45">
                      {mod.locked ? "Locked" : mod.estimatedMinutes ? `~${mod.estimatedMinutes}m` : "Open"}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={mod.slug} className="border-b border-sife-white/10 sm:border-r">
                  {mod.locked && !active ? (
                    <div className="flex gap-3 px-4 py-3 opacity-50">{row}</div>
                  ) : (
                    <Link
                      href={href}
                      className={`flex gap-3 px-4 py-3 hover:bg-sife-white/5 ${active ? "bg-sife-white/10" : ""}`}
                    >
                      {row}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <div
        ref={shellRef}
        className={`sife-course-shell mx-auto grid max-w-[96rem] ${
          layout === "split" ? "sife-course-shell--split" : ""
        }`}
        style={shellStyle}
      >
        {/* STAGE — sticky on desktop; page scroll moves notes, then footer */}
        <section className={`sife-course-stage ${showStage ? "block" : "hidden"}`}>
          <div className="sife-course-stage-sticky bg-sife-cream px-3 py-4 text-sife-ink sm:px-5 lg:py-5">
            <p className="mb-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-navy/55">
              Player
            </p>
            {locked ? (
              <div className="relative aspect-video w-full bg-sife-navy">
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sife-lime">
                    Locked
                  </p>
                  <p className="mt-3 max-w-sm text-sm text-sife-white/75">
                    Unlock to watch{hasVideo ? " video" : ""} and open stills wide.
                  </p>
                </div>
              </div>
            ) : stageImage ? (
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <Image
                    src={stageImage.image.src}
                    alt={stageImage.caption || stageImage.image.alt || moduleTitle}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-contain"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/55">
                    {stageImage.caption || `Still ${imageIndex + 1}/${images.length}`}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {images.length > 1 ? (
                      <>
                        <button
                          type="button"
                          className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-navy disabled:opacity-35"
                          disabled={imageIndex <= 0}
                          onClick={() => openStill(imageIndex - 1)}
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-navy disabled:opacity-35"
                          disabled={imageIndex >= images.length - 1}
                          onClick={() => openStill(imageIndex + 1)}
                        >
                          Next →
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setStage({ kind: "video" })}
                      className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-coral"
                    >
                      Back to video
                    </button>
                  </div>
                </div>
              </div>
            ) : primary ? (
              <div>
                <div className="overflow-hidden bg-black">
                  <VideoEmbed
                    url={primary.url}
                    title={primary.label || moduleTitle}
                    eager
                    autoplay
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/55">
                    {primary.label || parsed?.hostLabel || "Lesson video"}
                  </p>
                  {parsed?.externalUrl ? (
                    <a
                      href={parsed.externalUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-navy"
                    >
                      Open on {parsed.hostLabel} ↗
                    </a>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center border border-sife-ink/10 bg-sife-navy/5 px-6 text-center">
                <p className="text-sm uppercase tracking-[0.16em] text-sife-navy/70">
                  {images.length ? "Open a still from notes for wide view" : "Notes-only chapter"}
                </p>
              </div>
            )}

            {!locked && stage.kind === "video" && images.length > 0 ? (
              <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((item, i) => (
                  <li key={`${item.image.src}-thumb-${i}`} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => openStill(i)}
                      className="relative block h-14 w-24 overflow-hidden bg-sife-navy/10 ring-1 ring-sife-ink/15 hover:ring-sife-navy sm:h-16"
                    >
                      <Image
                        src={item.image.src}
                        alt={item.caption || "Still"}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {layout === "split" ? (
          <button
            type="button"
            aria-label="Drag to resize video and notes. Double-click to expand video."
            title="Drag to resize"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            onDoubleClick={onDividerDoubleClick}
            className="sife-course-divider group relative z-20 hidden min-h-[12rem] w-full cursor-col-resize touch-none self-stretch lg:block"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-sife-ink/25 transition-colors group-hover:bg-sife-coral group-active:bg-sife-coral"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-8 left-1/2 h-5 w-0.5 -translate-x-1/2 rounded-full bg-sife-coral"
            />
          </button>
        ) : null}

        {isDesktop && layout === "video" ? (
          <button
            type="button"
            aria-label="Show notes beside video"
            title="Show notes"
            onClick={() => {
              setLayout("split");
              setSplitPct(SPLIT_DEFAULT);
            }}
            className="fixed top-1/2 right-0 z-30 flex h-24 w-5 -translate-y-1/2 items-center justify-center bg-sife-coral text-sife-white shadow-lg hover:w-7 hover:bg-sife-navy"
          >
            <span className="rotate-90 text-[0.55rem] font-bold uppercase tracking-[0.14em]">Notes</span>
          </button>
        ) : null}

        {isDesktop && layout === "notes" ? (
          <button
            type="button"
            aria-label="Show video beside notes"
            title="Show video"
            onClick={() => {
              setLayout("split");
              setSplitPct(SPLIT_DEFAULT);
            }}
            className="fixed top-1/2 left-0 z-30 flex h-24 w-5 -translate-y-1/2 items-center justify-center bg-sife-coral text-sife-white shadow-lg hover:w-7 hover:bg-sife-navy"
          >
            <span className="-rotate-90 text-[0.55rem] font-bold uppercase tracking-[0.14em]">Video</span>
          </button>
        ) : null}

        {/* NOTES — normal page flow (wheel anywhere scrolls; then footer) */}
        <section
          className={`flex flex-col border-t border-sife-ink/10 bg-sife-cream lg:border-t-0 ${
            showNotes ? "" : "hidden"
          }`}
        >
          <div className="border-b border-sife-ink/10 px-4 py-5 sm:px-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
              Chapter {String(moduleIndex + 1).padStart(2, "0")}
              {estimatedMinutes ? ` · ~${estimatedMinutes} min` : ""}
            </p>
            <h1 className="mt-2 text-[clamp(1.25rem,2.6vw,1.7rem)] font-semibold uppercase leading-[0.98] tracking-[-0.035em]">
              {moduleTitle}
            </h1>
            {moduleTeaser ? (
              <p className="mt-3 text-sm leading-relaxed text-sife-ink/70">{moduleTeaser}</p>
            ) : null}
          </div>

          <div className="px-4 py-6 sm:px-6">
            <div className="sife-course-notes">{notes}</div>

            {!locked && images.length > 0 ? (
              <section className="mt-10 border-t border-sife-ink/15 pt-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                  Stills
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-sife-ink/45">
                  Tap to open wide in the player
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {images.map((item, i) => (
                    <li key={`${item.image.src}-note-${i}`}>
                      <button
                        type="button"
                        onClick={() => openStill(i)}
                        className="w-full overflow-hidden border border-sife-ink/10 text-left hover:border-sife-navy"
                      >
                        <div className="relative aspect-[16/10] bg-sife-navy">
                          <Image
                            src={item.image.src}
                            alt={item.caption || item.image.alt || moduleTitle}
                            fill
                            sizes="(max-width: 1024px) 100vw, 20rem"
                            className="object-cover"
                          />
                        </div>
                        <span className="block px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/55">
                          {item.caption || "Open wide →"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <nav className="sticky bottom-0 flex border-t border-sife-ink/10 bg-sife-cream">
            {prev && !prev.locked ? (
              <Link
                href={`/academy/${courseSlug}/${prev.slug}`}
                className="flex min-w-0 flex-1 flex-col justify-center border-r border-sife-ink/10 px-4 py-4 hover:bg-sife-navy/5"
              >
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/45">
                  Previous
                </span>
                <span className="mt-1 truncate text-xs font-bold uppercase tracking-[0.08em] text-sife-navy">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div className="flex flex-1 items-center border-r border-sife-ink/10 px-4 py-4">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/30">
                  {prev ? "Previous locked" : "Start"}
                </span>
              </div>
            )}

            {next && !next.locked ? (
              <Link
                href={`/academy/${courseSlug}/${next.slug}`}
                className="flex min-w-0 flex-[1.2] items-center justify-between gap-2 bg-sife-coral px-4 py-4 text-sife-white hover:bg-sife-navy"
              >
                <span className="min-w-0">
                  <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-white/80">
                    Next
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold uppercase tracking-[0.08em]">
                    {next.title}
                  </span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            ) : next ? (
              <div className="flex flex-[1.2] flex-col justify-center px-4 py-4">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/40">
                  Next locked
                </span>
              </div>
            ) : (
              <Link
                href={`/academy/${courseSlug}`}
                className="flex flex-[1.2] items-center justify-between bg-sife-navy px-4 py-4 text-sife-white hover:bg-sife-coral"
              >
                <span>
                  <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-sife-lime">
                    Done
                  </span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-[0.08em]">
                    Back to course
                  </span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            )}
          </nav>
        </section>
      </div>
    </div>
  );
}
