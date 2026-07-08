import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GuestbookEntry } from '../../../core/models/guestbook-entry.model';
import { GuestbookService } from '../../../core/services/guestbook.service';
import { StarRating } from '../../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-admin-guestbook',
  standalone: true,
  imports: [MatTableModule, MatIconModule, StarRating, DatePipe],
  templateUrl: './admin-guestbook.component.html',
  styleUrl: './admin-guestbook.component.scss',
})
export class AdminGuestbook {
  private guestbookService = inject(GuestbookService);

  displayedColumns = ['image', 'name', 'rating', 'message', 'date', 'actions'];
  entries$ = this.guestbookService.getAllEntries();

  deleteEntry(entry: GuestbookEntry): void {
    if (!entry.id || !confirm(`Delete guestbook entry from ${entry.name}?`)) return;
    this.guestbookService.deleteEntry(entry.id);
  }
}
