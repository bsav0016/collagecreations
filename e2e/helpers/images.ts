import { deflateSync } from 'node:zlib';

// Solid-colour PNG files made in memory with no dependencies, so the tests can upload real images without any binary
// files in the repository. The tiles of a collage should differ from each other, so each gets its own colour.

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** A width x height PNG filled with one colour. */
export function solidPng(width: number, height: number, [r, g, b]: [number, number, number]): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) row.set([r, g, b], 1 + x * 3);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const COLOURS: [number, number, number][] = [
  [220, 60, 60], [60, 160, 90], [60, 90, 200], [230, 190, 50], [150, 70, 180], [60, 190, 190], [240, 130, 60], [120, 120, 120],
];

/** `count` small tile images, each a different colour, in the form Playwright's file upload takes. */
export function tileFiles(count: number, size = 96) {
  return Array.from({ length: count }, (_, i) => ({
    name: `tile-${i + 1}.png`,
    mimeType: 'image/png',
    buffer: solidPng(size, size, COLOURS[i % COLOURS.length]),
  }));
}
