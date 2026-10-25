import fs from "fs";
import path from "path";
import sharp from "sharp";

const srcDir = "C:/Users/Admin/Desktop/SportIsForEveryone/sportisforevery1";
const destDir = path.resolve("public/seed/instagram");
const manifestPath = path.resolve("src/seed/instagram-manifest.ts");

fs.mkdirSync(destDir, { recursive: true });

const files = fs
  .readdirSync(srcDir)
  .filter((name) => name.startsWith("sportisforevery1_") && name.endsWith(".jpg"))
  .map((name) => {
    const parts = name.split("_");
    const unix = Number(parts[1]);
    const mediaId = parts[2] || String(unix);
    return {
      unix,
      mediaId,
      name,
      file: path.join(srcDir, name),
      size: fs.statSync(path.join(srcDir, name)).size,
    };
  })
  .sort((a, b) => b.unix - a.unix);

const seen = new Set<number>();
const picks: typeof files = [];
for (const file of files) {
  if (seen.has(file.unix)) continue;
  seen.add(file.unix);
  const same = files.filter((item) => item.unix === file.unix).sort((a, b) => b.size - a.size)[0];
  picks.push(same);
}

for (const stale of fs.readdirSync(destDir)) {
  if (stale.endsWith(".jpg") || stale.endsWith(".png")) {
    fs.unlinkSync(path.join(destDir, stale));
  }
}

const manifest: Array<{ id: string; unix: number; file: string; postedAt: string }> = [];

for (const pick of picks) {
  const file = `ig-${pick.mediaId}.jpg`;
  const out = path.join(destDir, file);
  await sharp(pick.file)
    .rotate()
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  manifest.push({
    id: pick.mediaId,
    unix: pick.unix,
    file,
    postedAt: new Date(pick.unix * 1000).toISOString(),
  });
  console.log(`${pick.name} -> ${file} ${Math.round(fs.statSync(out).size / 1024)}KB`);
}

fs.writeFileSync(
  manifestPath,
  `export const instagramManifest = ${JSON.stringify(manifest, null, 2)} as Array<{ id: string; unix: number; file: string; postedAt: string }>;\n`,
);
console.log(`Wrote ${manifest.length} stills + ${path.relative(process.cwd(), manifestPath)}`);
