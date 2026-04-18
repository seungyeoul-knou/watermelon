import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

function iconSvg(size) {
  const s = size;
  const pad = s * 0.15;
  const bg = s - pad * 2;
  const cx = s * 0.5;
  const cy = s * 0.53;
  const seed = s * 0.022;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <rect x="${pad}" y="${pad}" width="${bg}" height="${bg}" rx="${s * 0.14}" fill="#b8d967"/>
    <g transform="translate(${cx} ${cy})">
      <path d="M ${-s * 0.34} ${s * 0.1} A ${s * 0.34} ${s * 0.34} 0 0 1 ${s * 0.34} ${s * 0.1} Z" fill="#0e5229"/>
      <path d="M ${-s * 0.29} ${s * 0.06} A ${s * 0.29} ${s * 0.29} 0 0 1 ${s * 0.29} ${s * 0.06} Z" fill="#2baa4b"/>
      <path d="M ${-s * 0.24} ${s * 0.015} A ${s * 0.24} ${s * 0.24} 0 0 1 ${s * 0.24} ${s * 0.015} Z" fill="#ff4f62"/>
      <path d="M ${-s * 0.34} ${s * 0.1} L ${s * 0.34} ${s * 0.1}" stroke="#083b1d" stroke-width="${s * 0.032}" stroke-linecap="round"/>
      <ellipse cx="${-s * 0.12}" cy="${-s * 0.03}" rx="${seed * 0.72}" ry="${seed * 1.45}" fill="#19131a" transform="rotate(18 ${-s * 0.12} ${-s * 0.03})"/>
      <ellipse cx="${s * 0.01}" cy="${-s * 0.09}" rx="${seed * 0.72}" ry="${seed * 1.45}" fill="#19131a" transform="rotate(-12 ${s * 0.01} ${-s * 0.09})"/>
      <ellipse cx="${s * 0.14}" cy="${-s * 0.03}" rx="${seed * 0.72}" ry="${seed * 1.45}" fill="#19131a" transform="rotate(12 ${s * 0.14} ${-s * 0.03})"/>
      <circle cx="${-s * 0.09}" cy="${s * 0.025}" r="${s * 0.011}" fill="#35202a"/>
      <circle cx="${s * 0.09}" cy="${s * 0.025}" r="${s * 0.011}" fill="#35202a"/>
      <path d="M ${-s * 0.035} ${s * 0.04} Q 0 ${s * 0.065} ${s * 0.035} ${s * 0.04}" fill="none" stroke="#35202a" stroke-width="${s * 0.01}" stroke-linecap="round"/>
      <circle cx="${-s * 0.15}" cy="${s * 0.04}" r="${s * 0.018}" fill="#ff8b94" opacity="0.72"/>
      <circle cx="${s * 0.15}" cy="${s * 0.04}" r="${s * 0.018}" fill="#ff8b94" opacity="0.72"/>
    </g>
  </svg>`;
}

function ogSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f8fbff"/>
    <rect x="96" y="86" width="1032" height="458" rx="36" fill="#ffffff" stroke="#dce4ef" stroke-width="2"/>
    <g transform="translate(218 315)">
      <rect x="-96" y="-96" width="192" height="192" rx="34" fill="#b8d967"/>
      <path d="M -65 20 A 65 65 0 0 1 65 20 Z" fill="#0e5229"/>
      <path d="M -56 12 A 56 56 0 0 1 56 12 Z" fill="#2baa4b"/>
      <path d="M -46 3 A 46 46 0 0 1 46 3 Z" fill="#ff4f62"/>
      <path d="M -65 20 L 65 20" stroke="#083b1d" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="-23" cy="-6" rx="4" ry="8" fill="#19131a" transform="rotate(18 -23 -6)"/>
      <ellipse cx="2" cy="-18" rx="4" ry="8" fill="#19131a" transform="rotate(-12 2 -18)"/>
      <ellipse cx="27" cy="-6" rx="4" ry="8" fill="#19131a" transform="rotate(12 27 -6)"/>
      <circle cx="-17" cy="5" r="3" fill="#35202a"/>
      <circle cx="17" cy="5" r="3" fill="#35202a"/>
      <path d="M -7 9 Q 0 14 7 9" fill="none" stroke="#35202a" stroke-width="2" stroke-linecap="round"/>
      <circle cx="-29" cy="9" r="4" fill="#ff8b94" opacity="0.72"/>
      <circle cx="29" cy="9" r="4" fill="#ff8b94" opacity="0.72"/>
    </g>
    <text x="350" y="286" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="800" fill="#1e2a44">Watermelon</text>
    <text x="354" y="352" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="500" fill="#6d7690">Workflows for AI agents</text>
  </svg>`;
}

async function writePng(name, size) {
  await sharp(Buffer.from(iconSvg(size))).png().toFile(path.join(root, name));
}

function makeIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6 + count * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = header.length;

  pngBuffers.forEach((entry, index) => {
    const { size, buffer } = entry;
    const base = 6 + index * 16;
    header[base] = size >= 256 ? 0 : size;
    header[base + 1] = size >= 256 ? 0 : size;
    header[base + 2] = 0;
    header[base + 3] = 0;
    header.writeUInt16LE(1, base + 4);
    header.writeUInt16LE(32, base + 6);
    header.writeUInt32LE(buffer.length, base + 8);
    header.writeUInt32LE(offset, base + 12);
    offset += buffer.length;
  });

  return Buffer.concat([header, ...pngBuffers.map((entry) => entry.buffer)]);
}

async function main() {
  await writePng("logo-48.png", 48);
  await writePng("logo-96.png", 96);
  await writePng("favicon.png", 32);
  await writePng("icon-192.png", 192);
  await writePng("icon-512.png", 512);
  await writePng("apple-touch-icon.png", 180);
  await sharp(Buffer.from(ogSvg())).png().toFile(path.join(root, "og-cover.png"));

  const icoFrames = [];
  for (const size of [16, 32, 48]) {
    icoFrames.push({
      size,
      buffer: await sharp(Buffer.from(iconSvg(size))).png().toBuffer(),
    });
  }
  fs.writeFileSync(path.join(root, "favicon.ico"), makeIco(icoFrames));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
