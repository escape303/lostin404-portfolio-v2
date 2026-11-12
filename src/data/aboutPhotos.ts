/**
 * Canonical manifest of the personal photographs in `public/gallery/`.
 *
 * `id` is the original filename as uploaded; `src` points at the web-ready copy
 * that `npm run build` places in `dist/gallery/` (same photo, scaled down, `~`
 * replaced with `-` so hosting accepts the path). Paths are Vite public URLs and
 * are never read from disk at runtime.
 */
export type AboutPhoto = {
  id: string;
  src: string;
  alt: string;
  /** Optional art direction used by the horizontal archive carousel. */
  offset?: number;
  height?: number;
  position?: string;
  caption?: string;
};

export const aboutPhotos: readonly AboutPhoto[] = [
  { id: "1770055752365~3.png", src: "/gallery/1770055752365-3.png", alt: "Personal photograph 01" },
  { id: "1772594748050~2.png", src: "/gallery/1772594748050-2.png", alt: "Personal photograph 02" },
  { id: "1773808108325~2.png", src: "/gallery/1773808108325-2.png", alt: "Personal photograph 03" },
  { id: "1776161051326.png", src: "/gallery/1776161051326.png", alt: "Personal photograph 04" },
  { id: "1781916206050.png", src: "/gallery/1781916206050.png", alt: "Personal photograph 05" },
  { id: "1785277130511~2.png", src: "/gallery/1785277130511-2.png", alt: "Personal photograph 06" },
  { id: "1787101110865~2.jpg", src: "/gallery/1787101110865-2.jpg", alt: "Personal photograph 07" },
  { id: "1787873395738~3.jpg", src: "/gallery/1787873395738-3.jpg", alt: "Personal photograph 08" },
  { id: "1788996841797~2.jpg", src: "/gallery/1788996841797-2.jpg", alt: "Personal photograph 09" },
  { id: "1790948144385.jpg", src: "/gallery/1790948144385.jpg", alt: "Personal photograph 10" },
  {
    id: "file_00000000129c71f484861951cfc5dfdf.png",
    src: "/gallery/file_00000000129c71f484861951cfc5dfdf.png",
    alt: "Personal photograph 11",
  },
  {
    id: "file_000000006e9c8246af87e0ac813a3626.png",
    src: "/gallery/file_000000006e9c8246af87e0ac813a3626.png",
    alt: "Personal photograph 12",
  },
  {
    id: "file_0000000089688246a5723a0f7d5b0700.png",
    src: "/gallery/file_0000000089688246a5723a0f7d5b0700.png",
    alt: "Personal photograph 13",
  },
  {
    id: "file_000000009738720a85c9c3447cc1ccd5.png",
    src: "/gallery/file_000000009738720a85c9c3447cc1ccd5.png",
    alt: "Personal photograph 14",
  },
  {
    id: "file_00000000b6f882468bc9103d6df58ba2.png",
    src: "/gallery/file_00000000b6f882468bc9103d6df58ba2.png",
    alt: "Personal photograph 15",
  },
];

export const aboutPhotoCount = aboutPhotos.length;
