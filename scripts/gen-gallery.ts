import fs from "fs";
import path from "path";

const p = "public/gallery";
fs.mkdirSync(p, { recursive: true });
const exts = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const files = fs.readdirSync(p).filter((n) => exts.has(path.extname(n).toLowerCase()));
files.sort();
const ts = `// Auto-generated from public/gallery/
// ${files.length} images

export const galleryFiles: readonly string[] = [
  ${files.map((n) => JSON.stringify(n)).join(",\n  ")}
];

export const galleryPhotoCount = ${files.length};
`;
fs.writeFileSync("src/data/galleryPhotos.ts", ts);
console.log("generated", files.length, "images");
