import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crcBuf]);
}

function createPng(size: number): Buffer {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = createChunk("IHDR", ihdrData);

  // Generate pixels for a glowing golden lightbulb on dark rounded tile
  const rawScanlines: Buffer[] = [];
  const radius = size * 0.28;
  const center = (size - 1) / 2;

  for (let y = 0; y < size; y++) {
    const scanline = Buffer.alloc(1 + size * 4);
    scanline[0] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const idx = 1 + x * 4;

      // Coordinate from center (-1 to 1)
      const nx = (x - center) / center;
      const ny = (y - center) / center;

      // Rounded rectangle background tile
      const absX = Math.abs(nx);
      const absY = Math.abs(ny);
      const cornerR = 0.35;
      let inTile = false;

      if (absX < 0.9 && absY < 0.9) {
        if (absX > 0.9 - cornerR && absY > 0.9 - cornerR) {
          const dx = absX - (0.9 - cornerR);
          const dy = absY - (0.9 - cornerR);
          inTile = dx * dx + dy * dy <= cornerR * cornerR;
        } else {
          inTile = true;
        }
      }

      if (!inTile) {
        // Transparent outside tile
        scanline[idx] = 0;
        scanline[idx + 1] = 0;
        scanline[idx + 2] = 0;
        scanline[idx + 3] = 0;
        continue;
      }

      // Default Navy background (#1E1338)
      let r = 30;
      let g = 19;
      let b = 56;
      let a = 255;

      // Subtle gold border
      const isBorder =
        (absX > 0.82 || absY > 0.82) && (absX <= 0.88 && absY <= 0.88);
      if (isBorder) {
        r = 180;
        g = 130;
        b = 30;
      }

      // Lightbulb geometry:
      // Head: Circle centered at (0, -0.15) with radius 0.42
      const bulbHeadDy = ny - (-0.15);
      const headDist = Math.sqrt(nx * nx + bulbHeadDy * bulbHeadDy);

      // Bulb body tapered neck down to ny = 0.45
      const inBulbNeck =
        ny >= -0.15 &&
        ny <= 0.42 &&
        absX <= 0.42 - (ny - -0.15) * 0.42;

      const inBulbHead = headDist <= 0.42;
      const inBulb = inBulbHead || inBulbNeck;

      // Bulb base (screw threads) ny: 0.42 to 0.65, absX <= 0.18
      const inBase = ny > 0.42 && ny <= 0.62 && absX <= 0.18;
      const inBaseTip = ny > 0.62 && ny <= 0.72 && absX <= 0.11;

      // Glow halo around bulb
      if (headDist < 0.65 && !inBulb) {
        const glowFactor = 1 - (headDist - 0.42) / 0.23;
        if (glowFactor > 0) {
          r = Math.min(255, Math.round(r + 180 * glowFactor));
          g = Math.min(255, Math.round(g + 130 * glowFactor));
          b = Math.min(255, Math.round(b + 20 * glowFactor));
        }
      }

      if (inBulb) {
        // Bright golden gradient from #FFF59D to #F59E0B
        const grad = (ny + 0.57) / 1.0;
        r = Math.round(255 - grad * 10);
        g = Math.round(230 - grad * 70);
        b = Math.round(90 - grad * 80);

        // Core bright highlight inside bulb
        if (headDist < 0.22 && ny < 0.1) {
          r = 255;
          g = 255;
          b = 230;
        }
      } else if (inBase) {
        // Metallic golden screw base
        const stripe = Math.sin(ny * 40) > 0;
        r = stripe ? 245 : 217;
        g = stripe ? 180 : 140;
        b = stripe ? 40 : 20;
      } else if (inBaseTip) {
        // Amber/dark bottom contact
        r = 180;
        g = 90;
        b = 10;
      }

      scanline[idx] = r;
      scanline[idx + 1] = g;
      scanline[idx + 2] = b;
      scanline[idx + 3] = a;
    }

    rawScanlines.push(scanline);
  }

  const rawData = Buffer.concat(rawScanlines);
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk("IDAT", compressed);
  const iend = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

function createIco(png32: Buffer): Buffer {
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // icon type
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = 32; // width
  dirEntry[1] = 32; // height
  dirEntry[2] = 0;  // colors
  dirEntry[3] = 0;  // reserved
  dirEntry.writeUInt16LE(1, 4); // planes
  dirEntry.writeUInt16LE(32, 6); // bpp
  dirEntry.writeUInt32LE(png32.length, 8); // size
  dirEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  return Buffer.concat([icoHeader, dirEntry, png32]);
}

const publicDir = path.resolve("public");
const png32 = createPng(32);
const png192 = createPng(192);
const ico = createIco(png32);

fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
fs.writeFileSync(path.join(publicDir, "favicon.png"), png32);
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), png192);

console.log("Successfully generated favicon.ico, favicon.png, apple-touch-icon.png with Lightbulb icon!");
