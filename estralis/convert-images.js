import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

fs.readdirSync(publicDir).forEach(file => {
    if (file.toLowerCase().endsWith('.png')) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace(/\.png$/i, '.webp'));
        
        console.log(`Converting ${file} to WebP...`);
        
        sharp(inputPath)
            .resize({ width: 800, withoutEnlargement: true }) // Limit pixels for GPU memory
            .webp({ quality: 40 }) // Very low quality for fastest possible load on iPhone
            .toFile(outputPath)
            .then(() => console.log(`Successfully created ${outputPath}`))
            .catch(err => console.error(`Error converting ${file}:`, err));
    }
});
