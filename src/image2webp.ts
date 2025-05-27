import sharp from 'sharp';

export async function convertToWebp(input: string, output: string): Promise<void> {
  await sharp(input)
    .webp({ quality: 100 })
    .toFile(output);
}
