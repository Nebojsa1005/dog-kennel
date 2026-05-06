import { Component, Input, signal } from '@angular/core';
import { NgIf } from '@angular/common';

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

  hasError = signal(false);

  get showPlaceholder(): boolean {
    return !this.src || this.hasError();
  }

  onError() {
    this.hasError.set(true);
  }
}
