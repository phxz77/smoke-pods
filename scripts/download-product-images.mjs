import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "..", "public", "products")

/** URLs publicas de imagens de produto (lojas / fabricantes) */
const productImages = {
  "ignite-v50.jpg":
    "https://cdn.shopify.com/s/files/1/0503/8578/0904/files/ignite-v50-disposable-vape-device-5000-puffs-1pack.jpg",
  "elfbar-bc5000.jpg":
    "https://www.vapes-pens.com/wp-content/uploads/2023/12/clear.jpg",
  "lost-mary.jpg":
    "https://www.uvapefl.com/cdn/shop/files/Cherry_Lemon_600x_turbo_1296x_de490b41-113c-4b6e-83c2-035fe7bdf7f1_1120x.png",
  "elf-world.jpg":
    "https://www.vapes-pens.com/wp-content/uploads/2023/12/black-winter-600x600.jpg",
  "vozol-star.jpg":
    "https://www.vapesizzle.co.uk/wp-content/uploads/2023/12/kiwi-dragon-fruit-berry.jpg",
  "oxbar-g8000.jpg":
    "https://www.vapes-pens.com/wp-content/uploads/2023/12/cuba-cigar.jpg",
  "smok-nord4.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/797/2417/Nord-4-Pod-Epty-SMOK-1-320__22176__82928.1759875998.jpg",
  "vaporesso-xros3.jpg":
    "https://cdn.shopify.com/s/files/1/0071/4758/5626/files/XROS3_SkyBlue-1.png",
  "caliburn-g2.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/1115/3723/Uwell-Caliburn-G2-Pod-Kit-6-320__50658__77254.1759876869.jpg",
  "wenax-k1.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/2653/7977/Geek-Vape-Wenax-q-pod-320__35216__45275.1759879585.jpg",
  "juice-mango.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/1906/5795/hi-drip-iced-peachy-mango-30ml-by-hi-drip-salt-20mg__55903__90839.1759877934.jpg",
  "juice-grape.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/958/11868/ICE_Grape-Apple-50-320__28999.1773158120.jpg",
  "juice-watermelon.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/1766/5453/CloudNurdz_IcedAppleWatermelon_25_320__55104__42763.1759877778.jpg",
  "juice-strawberry.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/1776/5475/pacha-mama-salt-strawberry-watermelon-30ml-pacha-syn-salt-25mg__52114__30479.1759877787.jpg",
  "cartucho-xros.jpg":
    "https://cdn.shopify.com/s/files/1/0071/4758/5626/files/XROS_0.8_MESH_Pod-3ml_new.png",
  "coil-smok.jpg":
    "https://cdn11.bigcommerce.com/s-gvg0alm7la/images/stencil/1280x1280/products/320/929/Nord-320__22382__10125.1759874957.jpg",
}

async function downloadFile(filename, url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SmokePodsCatalog/1.0)",
      Accept: "image/*,*/*",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const filepath = path.join(outDir, filename)
  await writeFile(filepath, buffer)
  console.log(`OK: ${filename}`)
}

await mkdir(outDir, { recursive: true })

const failures = []

for (const [filename, url] of Object.entries(productImages)) {
  try {
    await downloadFile(filename, url)
  } catch (error) {
    failures.push({ filename, url, error: error.message })
    console.error(`FAIL: ${filename} - ${error.message}`)
  }
}

if (failures.length > 0) {
  console.log("\nAlgumas imagens falharam. Verifique URLs ou baixe manualmente.")
  process.exitCode = 1
} else {
  console.log("\nTodas as imagens foram baixadas em public/products/")
}
