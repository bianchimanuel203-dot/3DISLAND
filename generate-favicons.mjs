import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, "public", "logo.png");
const out = path.join(__dirname, "public");

async function generate() {
  await sharp(input).resize(16, 16).png().toFile(path.join(out, "favicon-16x16.png"));
  console.log("✓ favicon-16x16.png");

  await sharp(input).resize(32, 32).png().toFile(path.join(out, "favicon-32x32.png"));
  console.log("✓ favicon-32x32.png");

  await sharp(input).resize(180, 180).png().toFile(path.join(out, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png");

  await sharp(input).resize(192, 192).png().toFile(path.join(out, "icon-192.png"));
  console.log("✓ icon-192.png");

  await sharp(input).resize(512, 512).png().toFile(path.join(out, "icon-512.png"));
  console.log("✓ icon-512.png");

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
  .composite([{
    input: await sharp(input).resize(300, 300, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
    gravity: "centre"
  }])
  .png()
  .toFile(path.join(out, "og-image.png"));
  console.log("✓ og-image.png");

  console.log("\n✅ Todos los archivos generados en /public");
}

generate().catch(console.error);