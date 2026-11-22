"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { FaYoutube } from "react-icons/fa";
import { X, Play, ExternalLink } from "lucide-react";

export interface IDemoVideoConfig {
  pageId: string;
  pageName: string;
  path: string;
  section?: string;
  youtubeUrl: string;
  isActive: boolean;
  title?: string;
  description?: string;
}

interface DemoVideoFloatingButtonProps {
  demoVideos?: IDemoVideoConfig[];
  masterEnabled?: boolean;
}

/**
 * Robust YouTube video ID extractor supporting watch, youtu.be, embed, shorts, and raw ID.
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0] || null;
  }
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export default function DemoVideoFloatingButton({
  demoVideos = [],
  masterEnabled = true,
}: DemoVideoFloatingButtonProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Match current route against configured demo videos
  const activeVideo = useMemo(() => {
    if (!masterEnabled || !Array.isArray(demoVideos) || demoVideos.length === 0) {
      return null;
    }

    // 1. Exact path match
    let match = demoVideos.find((v) => v.path === pathname);

    // 2. Subroute prefix match (e.g. /dashboard/products/create -> /dashboard/products)
    if (!match && pathname !== "/dashboard") {
      match = demoVideos.find(
        (v) => v.path !== "/dashboard" && (pathname === v.path || pathname.startsWith(v.path + "/"))
      );
    }

    // 3. Fallback to /dashboard exact
    if (!match && pathname === "/dashboard") {
      match = demoVideos.find((v) => v.path === "/dashboard");
    }

    return match || null;
  }, [demoVideos, masterEnabled, pathname]);

  // Check session storage if user chose to completely hide from corner for this session
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined" && activeVideo) {
      try {
        const hiddenKey = `demo_video_hidden_${activeVideo.pageId || activeVideo.path}`;
        return sessionStorage.getItem(hiddenKey) === "1";
      } catch {}
    }
    return false;
  });

  useEffect(() => {
    if (activeVideo && typeof window !== "undefined") {
      try {
        const hiddenKey = `demo_video_hidden_${activeVideo.pageId || activeVideo.path}`;
        setIsPermanentlyHidden(sessionStorage.getItem(hiddenKey) === "1");
      } catch {
        setIsPermanentlyHidden(false);
      }
    } else {
      setIsPermanentlyHidden(false);
    }
  }, [activeVideo?.pageId, activeVideo?.path]);

  // Listen for openDemoVideo event (triggered from navbar or elsewhere)
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
      setIsPermanentlyHidden(false);
    };
    window.addEventListener("openDemoVideo", handleOpenEvent);
    return () => window.removeEventListener("openDemoVideo", handleOpenEvent);
  }, []);

  // Close modal when route changes or ESC is pressed
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Extract YouTube ID
  const youtubeId = activeVideo ? extractYouTubeId(activeVideo.youtubeUrl) : null;

  // Prevent any SSR/hydration flicker
  if (!mounted) {
    return null;
  }

  // STRICT CONDITIONAL RENDERING:
  // Must only show if:
  // 1. masterEnabled is true
  // 2. activeVideo exists
  // 3. activeVideo.isActive is true
  // 4. Valid YouTube ID extracted
  // 5. Not dismissed completely from corner for this session
  if (!masterEnabled || !activeVideo || !activeVideo.isActive || !youtubeId || isPermanentlyHidden) {
    return (
      // If modal is open (e.g. triggered from top navbar), still render the modal!
      isOpen && youtubeId ? (
        <VideoModal
          activeVideo={activeVideo!}
          youtubeId={youtubeId}
          onClose={() => setIsOpen(false)}
        />
      ) : null
    );
  }

  const handleDismissCompletely = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPermanentlyHidden(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(`demo_video_hidden_${activeVideo.pageId || activeVideo.path}`, "1");
      } catch {
        // ignore
      }
    }
  };

  return (
    <>
      {/* Floating Corner Button (Fixed at Bottom-Right without blinking animation) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden select-none">
        {isMinimized ? (
          // Minimized Floating Round Badge
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/90"
              title={`Watch ${activeVideo.pageName} Tutorial Video`}
              aria-label="Open Demo Video"
            >
              <FaYoutube className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
            </button>

            {/* Hover tooltip card */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 p-2 px-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap border border-slate-700">
              <span onClick={() => setIsOpen(true)} className="cursor-pointer hover:underline">
                ▶ Watch {activeVideo.pageName} Demo
              </span>
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="text-slate-400 hover:text-white ml-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800"
                title="Expand button"
              >
                Expand
              </button>
              <button
                type="button"
                onClick={handleDismissCompletely}
                className="text-slate-400 hover:text-red-400 px-1 py-0.5 rounded text-[10px] bg-slate-800"
                title="Hide completely"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          // Expanded Interactive Floating Banner / Pill
          <div className="flex items-center shadow-xl rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-1 pl-3.5 pr-1.5 border border-white/20 backdrop-blur-sm hover:shadow-red-500/25 transition-shadow">
            {/* Click to open modal */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 py-1 text-xs font-bold tracking-tight text-white cursor-pointer group pr-2"
              title={`Watch ${activeVideo.pageName} demonstration video`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FaYoutube className="w-4 h-4 text-white" />
              </div>
              <span className="truncate max-w-[170px] sm:max-w-[220px]">
                Watch {activeVideo.pageName} Demo
              </span>
              <Play className="w-3 h-3 fill-current opacity-80 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Minimize / Hide button (Cross click minimizes to keep it easily accessible) */}
            <div className="flex items-center border-l border-white/20 pl-1 ml-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Minimize tutorial button (can also be found in top header)"
                aria-label="Minimize button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Demonstration Modal */}
      {isOpen && (
        <VideoModal
          activeVideo={activeVideo}
          youtubeId={youtubeId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function VideoModal({
  activeVideo,
  youtubeId,
  onClose,
}: {
  activeVideo: IDemoVideoConfig;
  youtubeId: string;
  onClose: () => void;
}) {
  const videoTitle = activeVideo.title || `${activeVideo.pageName} - Demonstration Video`;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-xs">
              <FaYoutube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                {videoTitle}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-800/50">
                  {activeVideo.path}
                </span>
                <span>• Official Tutorial Guide</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1 text-xs"
              title="Open on YouTube website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player (Responsive 16:9 iframe) */}
        <div className="relative aspect-video w-full bg-black shadow-inner">
          <iframe
            src={embedUrl}
            title={videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <p className="line-clamp-2">
            {activeVideo.description ||
              `Follow this step-by-step demonstration video to master ${activeVideo.pageName} and optimize your store workflow.`}
          </p>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open on YouTube</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
