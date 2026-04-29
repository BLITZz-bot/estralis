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
            .resize({ width: 1000, withoutEnlargement: true }) // Limit pixels for GPU memory
            .webp({ quality: 60 }) // Lower quality for even smaller file sizes
            .toFile(outputPath)
            .then(() => console.log(`Successfully created ${outputPath}`))
            .catch(err => console.error(`Error converting ${file}:`, err));
    }
});
