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
  const cy = s * 0.5;
  const rx = s * 0.29;
  const ry = s * 0.37;
  const seed = s * 0.018;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <rect x="${pad}" y="${pad}" width="${bg}" height="${bg}" rx="${s * 0.14}" fill="#b8d967"/>
    <g transform="translate(${cx} ${cy}) rotate(28)">
      <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#123f22"/>
      <ellipse cx="0" cy="0" rx="${rx * 0.9}" ry="${ry * 0.9}" fill="#1f7a38"/>
      <ellipse cx="0" cy="${-ry * 0.02}" rx="${rx * 0.75}" ry="${ry * 0.76}" fill="#ef4458"/>
      <ellipse cx="0" cy="${-ry * 0.02}" rx="${rx * 0.58}" ry="${ry * 0.58}" fill="#ff6672" opacity="0.95"/>
      <path d="M ${-rx * 0.74} ${-ry * 0.1} C ${-rx * 0.25} ${-ry * 0.52}, ${rx * 0.3} ${-ry * 0.52}, ${rx * 0.74} ${-ry * 0.1}" fill="none" stroke="#7dcf52" stroke-width="${s * 0.035}" stroke-linecap="round" opacity="0.85"/>
      <ellipse cx="${-rx * 0.26}" cy="${-ry * 0.1}" rx="${seed * 0.78}" ry="${seed * 1.65}" fill="#1a1720" transform="rotate(-16 ${-rx * 0.26} ${-ry * 0.1})"/>
      <ellipse cx="${rx * 0.12}" cy="${-ry * 0.24}" rx="${seed * 0.78}" ry="${seed * 1.65}" fill="#1a1720" transform="rotate(18 ${rx * 0.12} ${-ry * 0.24})"/>
      <ellipse cx="${rx * 0.3}" cy="${ry * 0.12}" rx="${seed * 0.78}" ry="${seed * 1.65}" fill="#1a1720" transform="rotate(-8 ${rx * 0.3} ${ry * 0.12})"/>
      <ellipse cx="${-rx * 0.08}" cy="${ry * 0.22}" rx="${seed * 0.78}" ry="${seed * 1.65}" fill="#1a1720" transform="rotate(12 ${-rx * 0.08} ${ry * 0.22})"/>
      <ellipse cx="${-rx * 0.44}" cy="${ry * 0.2}" rx="${seed * 0.62}" ry="${seed * 1.35}" fill="#1a1720" transform="rotate(24 ${-rx * 0.44} ${ry * 0.2})"/>
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
      <g transform="rotate(28)">
        <ellipse cx="0" cy="0" rx="58" ry="74" fill="#123f22"/>
        <ellipse cx="0" cy="0" rx="52" ry="67" fill="#1f7a38"/>
        <ellipse cx="0" cy="-1" rx="44" ry="56" fill="#ef4458"/>
        <ellipse cx="0" cy="-1" rx="34" ry="42" fill="#ff6672" opacity="0.95"/>
        <path d="M -43 -7 C -15 -38, 18 -38, 43 -7" fill="none" stroke="#7dcf52" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
        <ellipse cx="-16" cy="-7" rx="3" ry="7" fill="#1a1720" transform="rotate(-16 -16 -7)"/>
        <ellipse cx="7" cy="-18" rx="3" ry="7" fill="#1a1720" transform="rotate(18 7 -18)"/>
        <ellipse cx="18" cy="9" rx="3" ry="7" fill="#1a1720" transform="rotate(-8 18 9)"/>
        <ellipse cx="-5" cy="16" rx="3" ry="7" fill="#1a1720" transform="rotate(12 -5 16)"/>
      </g>
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
