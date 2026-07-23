import { Component, Input, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { ImageModalService } from '../../../core/services/image-modal.service';

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

  private imageModalService = inject(ImageModalService);

  hasError = signal(false);

  get showPlaceholder(): boolean {
    return !this.src || this.hasError();
  }

  onError() {
    this.hasError.set(true);
  }

  onZoom(event: Event) {
    event.stopPropagation();
    if (this.src && !this.hasError()) {
      this.imageModalService.open(this.src, this.alt);
    }
  }
}
