import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { GuestbookEntry } from '../../../core/models/guestbook-entry.model';
import { GuestbookService } from '../../../core/services/guestbook.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';
import { DogImg } from '../../../shared/components/dog-img/dog-img';

@Component({
  selector: 'app-guestbook-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, StarRating, DogImg],
  templateUrl: './guestbook-list.html',
  styleUrl: './guestbook-list.scss',
})
export class GuestbookList implements OnInit {
  private guestbookService = inject(GuestbookService);

  readonly starOptions = [1, 2, 3, 4, 5];
  selectedRatings: number[] = [];
  private ratingFilter$ = new BehaviorSubject<number[]>([]);
  filteredEntries$!: Observable<GuestbookEntry[]>;

  ngOnInit(): void {
    this.filteredEntries$ = combineLatest([
      this.guestbookService.getAllEntries(),
      this.ratingFilter$,
    ]).pipe(
      map(([entries, ratings]) =>
        ratings.length === 0 ? entries : entries.filter(e => ratings.includes(e.rating))
      )
    );
  }

  toggleRating(star: number): void {
    this.selectedRatings = this.selectedRatings.includes(star)
      ? this.selectedRatings.filter(r => r !== star)
      : [...this.selectedRatings, star];
    this.ratingFilter$.next(this.selectedRatings);
  }

  clearFilter(): void {
    this.selectedRatings = [];
    this.ratingFilter$.next([]);
  }
}
