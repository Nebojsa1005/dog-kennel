import { Pipe, PipeTransform, inject } from '@angular/core';
import { ImageService } from '../../core/services/image.service';

@Pipe({ name: 'transformImage', standalone: true })
export class TransformImagePipe implements PipeTransform {
  private imageService = inject(ImageService);

  transform(url: string | null | undefined, width = 1200, quality: string | number = 'auto'): string {
    if (!url) return '';
    return this.imageService.transformImage(url, width, quality);
  }
}
