import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})
export class StarRating {
  @Input() rating = 0;
  @Input() readonly = false;
  @Output() ratingChange = new EventEmitter<number>();

  readonly stars = [1, 2, 3, 4, 5];
  hoverRating = signal(0);

  setHover(star: number): void {
    if (this.readonly) return;
    this.hoverRating.set(star);
  }

  clearHover(): void {
    this.hoverRating.set(0);
  }

  select(star: number): void {
    if (this.readonly) return;
    this.ratingChange.emit(star);
  }

  isFilled(star: number): boolean {
    return star <= (this.hoverRating() || this.rating);
  }
}
