import { Component, Input, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { ImageModalService } from '../../../core/services/image-modal.service';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-dog-img',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dog-img.html',
  styleUrl: './dog-img.scss',
})
export class DogImg {
  @Input() src: string | null | undefined = null;
  @Input() alt = '';
  @Input() aspectRatio: '1/1' | '4/3' | '3/4' | '16/9' = '4/3';
  @Input() zoomable = true;
  @Input() width = 300;
  @Input() images: string[] | null = null;
  @Input() index = 0;

  private imageModalService = inject(ImageModalService);
  private imageService = inject(ImageService);

  hasError = signal(false);

  get showPlaceholder(): boolean {
    return !this.src || this.hasError();
  }

  get displaySrc(): string | null | undefined {
    if (!this.src) return this.src;
    return this.imageService.transformImage(this.src, this.width);
  }

  onError() {
    this.hasError.set(true);
  }

  onZoom(event: Event) {
    event.stopPropagation();
    if (!this.src || this.hasError()) return;

    if (this.images?.length) {
      this.imageModalService.open(this.images, this.index, this.alt);
    } else {
      this.imageModalService.open([this.src], 0, this.alt);
    }
  }
}
