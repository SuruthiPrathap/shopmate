// Prepares the seller's business document before it is sent to the server.
// Photos are shrunk (phone photos can be 5 MB+), PDFs must be under 2 MB.
const MAX_PDF_BYTES = 2 * 1024 * 1024;

const PDF_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="12" fill="#fee2e2"/><text x="48" y="58" font-size="28" font-weight="700" text-anchor="middle" fill="#b91c1c" font-family="Arial">PDF</text></svg>'
  );

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read this file"));
    reader.readAsDataURL(file);
  });

const shrinkImage = (file, maxSide = 1400, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; // white background for transparent PNGs
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image. Please use a JPG or PNG photo."));
    };
    img.src = url;
  });

// Returns { dataUrl, name, preview } or throws an Error with a message for the user
export async function prepareDocument(file) {
  if (file.type === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) throw new Error("This PDF is too large. Please use a file under 2 MB.");
    return { dataUrl: await readAsDataUrl(file), name: file.name, preview: PDF_ICON };
  }
  if (file.type.startsWith("image/")) {
    const dataUrl = await shrinkImage(file);
    return { dataUrl, name: file.name, preview: dataUrl };
  }
  throw new Error("Please choose a photo (JPG, PNG, WEBP) or a PDF file.");
}