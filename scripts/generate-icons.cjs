import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public/icons');

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generando iconos PWA para Nightly...\n');

// Verificar que existe el logo
if (!fs.existsSync(inputFile)) {
  console.error('❌ Error: No se encuentra public/logo.png');
  console.error('   Coloca tu logo en public/logo.png (512x512px recomendado)');
  process.exit(1);
}

// Generar iconos estándar
const promises = sizes.map(size => {
  const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
  
  return sharp(inputFile)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputFile)
    .then(() => console.log(`✅ icon-${size}x${size}.png`))
    .catch(err => {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, err.message);
      throw err;
    });
});

// Generar iconos maskable (Android adaptive icons)
const maskableSizes = [192, 512];
const maskablePromises = maskableSizes.map(size => {
  const outputFile = path.join(outputDir, `icon-${size}x${size}-maskable.png`);
  const paddedSize = Math.floor(size * 0.8); // 20% padding
  const padding = Math.floor((size - paddedSize) / 2);
  
  return sharp(inputFile)
    .resize(paddedSize, paddedSize, {
      fit: 'contain',
      background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a - slate-900
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 15, g: 23, b: 42, alpha: 1 }
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputFile)
    .then(() => console.log(`✅ icon-${size}x${size}-maskable.png`))
    .catch(err => {
      console.error(`❌ Error generando maskable ${size}:`, err.message);
      throw err;
    });
});

// Generar favicon.ico
const faviconPromise = sharp(inputFile)
  .resize(32, 32, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png()
  .toFile(path.join(outputDir, 'favicon.png'))
  .then(() => {
    const pngPath = path.join(outputDir, 'favicon.png');
    const icoPath = path.join(outputDir, 'favicon.ico');
    
    if (fs.existsSync(icoPath)) {
      fs.unlinkSync(icoPath);
    }
    
    fs.renameSync(pngPath, icoPath);
    console.log('✅ favicon.ico');
  })
  .catch(err => {
    console.error('❌ Error generando favicon:', err.message);
    throw err;
  });

// Ejecutar todas las promesas
Promise.all([...promises, ...maskablePromises, faviconPromise])
  .then(() => {
    console.log('\n✨ ¡Iconos generados exitosamente!');
    console.log(`📁 Ubicación: ${outputDir}`);
    console.log(`📊 Total: ${sizes.length + maskableSizes.length + 1} iconos generados\n`);
    console.log('✅ Listo para PWA production-ready');
  })
  .catch(err => {
    console.error('\n❌ Error al generar iconos:', err);
    process.exit(1);
  });