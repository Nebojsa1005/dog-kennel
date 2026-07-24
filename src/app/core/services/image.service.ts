import { Injectable } from '@angular/core';

const CLOUDINARY_CLOUD_NAME = 'unyck77m';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

@Injectable({ providedIn: 'root' })
export class ImageService {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('Image upload failed');
    }

    return data.secure_url;
  }

  transformImage(url: string, width = 1200, quality: string | number = 'auto'): string {
    const marker = '/upload/';
    const index = url.indexOf(marker);
    if (index === -1) return url;

    const insertAt = index + marker.length;
    return `${url.slice(0, insertAt)}w_${width},q_${quality},f_auto/${url.slice(insertAt)}`;
  }
}
