import fs from 'fs/promises';
import path from 'path';

export async function uploadImage(image) {
  const filePath = path.join(process.cwd(), 'public', 'Uploads', image.name);
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(filePath, buffer);
}
