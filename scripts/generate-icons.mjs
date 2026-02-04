// Script para generar iconos PWA
// Instalar: npm install -D sharp
// Ejecutar: node scripts/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputImage = path.join(__dirname, '../public/logo.png'); // Tu logo aquí
const outputDir = path.join(__dirname, '../public/icons');

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...\n');
  
  // Verificar que existe el logo
  if (!fs.existsSync(inputImage)) {
    console.error('❌ Error: No se encontró logo.png en /public');
    console.log('💡 Por favor, coloca tu logo en frontend/public/logo.png');
    console.log('   Recomendación: imagen cuadrada de al menos 512x512px');
    process.exit(1);
  }
  
  try {
    // Generar iconos normales
    for (const size of sizes) {
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      console.log(`✅ Generado: icon-${size}x${size}.png`);
    }
    
    console.log('\n🎭 Generando iconos maskable...\n');
    
    // Generar iconos maskable (con padding del 20%)
    await sharp(inputImage)
      .resize(154, 154, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: 19,
        bottom: 19,
        left: 19,
        right: 19,
        background: { r: 147, g: 51, b: 234, alpha: 1 } // theme color
      })
      .png()
      .toFile(path.join(outputDir, 'icon-192x192-maskable.png'));
    console.log('✅ Generado: icon-192x192-maskable.png');
    
    await sharp(inputImage)
      .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: 51,
        bottom: 51,
        left: 51,
        right: 51,
        background: { r: 147, g: 51, b: 234, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-512x512-maskable.png'));
    console.log('✅ Generado: icon-512x512-maskable.png');
    
    console.log('\n🎉 ¡Todos los iconos generados exitosamente!\n');
    console.log('📁 Ubicación: frontend/public/icons/\n');
    
    // Generar favicon
    await sharp(inputImage)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    console.log('✅ Generado: favicon.ico\n');
    
  } catch (error) {
    console.error('❌ Error al generar iconos:', error.message);
    process.exit(1);
  }
}

generateIcons();
