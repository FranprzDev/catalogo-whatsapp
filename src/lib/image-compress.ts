// Client-side image compression: product photos are stored as WebP data URLs
// inside Postgres, so each image must stay well under a comfortable row size.
const MAX_BYTES = 600_000;
const MAX_DIMENSION = 1080;
const MIN_QUALITY = 0.4;

export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo tiene que ser una imagen.");
  }
  const bitmap = await createImageBitmap(file);
  try {
    let { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_DIMENSION);
    let quality = 0.8;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const dataUrl = renderToWebp(bitmap, width, height, quality);
      if (dataUrlSizeBytes(dataUrl) <= MAX_BYTES) {
        return dataUrl;
      }
      if (quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, quality - 0.1);
      } else {
        width = Math.max(64, Math.round(width * 0.8));
        height = Math.max(64, Math.round(height * 0.8));
      }
    }
    throw new Error("No se pudo comprimir la imagen. Probá con una foto más chica.");
  } finally {
    bitmap.close();
  }
}

function fitWithin(width: number, height: number, max: number): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function renderToWebp(bitmap: ImageBitmap, width: number, height: number, quality: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tu navegador no soporta el procesamiento de imágenes.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL("image/webp", quality);
}

function dataUrlSizeBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.ceil((base64.length * 3) / 4);
}
