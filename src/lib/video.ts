export type VideoEmbed =
  | { kind: "iframe"; src: string; provider: "youtube" | "facebook" | "vimeo" }
  | { kind: "file"; src: string }
  | null;

export function getVideoEmbed(rawUrl?: string | null): VideoEmbed {
  const url = (rawUrl ?? "").trim();
  if (!url) return null;

  // Archivos directos
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { kind: "file", src: url };
  }

  // YouTube
  const yt =
    url.match(/youtube\.com\/watch\?[^#]*\bv=([A-Za-z0-9_-]{6,})/) ??
    url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ??
    url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/) ??
    url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (yt) {
    return { kind: "iframe", provider: "youtube", src: `https://www.youtube.com/embed/${yt[1]}` };
  }

  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return { kind: "iframe", provider: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}` };
  }

  // Facebook (reels, share/v, watch, video)
  if (/facebook\.com|fb\.watch/i.test(url)) {
    return {
      kind: "iframe",
      provider: "facebook",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url,
      )}&show_text=false&autoplay=false`,
    };
  }

  // Fallback: intentar como iframe genérico no es seguro; se trata como archivo
  return { kind: "file", src: url };
}

/** Formatos verticales típicos (reels / shorts) */
export function isVerticalVideo(rawUrl?: string | null): boolean {
  const url = (rawUrl ?? "").toLowerCase();
  return /shorts\/|\/reel|\/share\/r\//.test(url);
}
