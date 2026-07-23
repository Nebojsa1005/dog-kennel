import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
 compressAndConvert(file: File, maxWidth = 1200, maxSizeBytes = 500 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    // Already under 500KB — return as-is, no processing needed
    if (file.size <= maxSizeBytes) {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, width, height);

        // Start at highest quality and step down until under 500KB
        let quality = 0.95;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (this.base64ToBytes(dataUrl) > maxSizeBytes && quality > 0.1) {
          quality = Math.round((quality - 0.05) * 100) / 100;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

private base64ToBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1];
  const padding = (base64.match(/=+$/) || [''])[0].length;
  return (base64.length * 3) / 4 - padding;
}

  getFileSizeKb(base64: string): number {
    return (base64.length * 0.75) / 1024;
  }

  validateSize(base64: string, maxKb = 500): boolean {
    return this.getFileSizeKb(base64) <= maxKb;
  }
}
