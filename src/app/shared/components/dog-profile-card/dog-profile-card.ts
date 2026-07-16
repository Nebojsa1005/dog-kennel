import { Component, Input, inject } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DogImg } from '../dog-img/dog-img';
import { ProfileCardItem } from '../../models/profile-card.model';
import { InquiryState } from '../../models/inquiry-state.model';

@Component({
  selector: 'app-dog-profile-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, DogImg],
  templateUrl: './dog-profile-card.html',
  styleUrl: './dog-profile-card.scss',
})
export class DogProfileCard {
  @Input() item!: ProfileCardItem;

  private router = inject(Router);

  onInquire(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/contact'], {
      state: { name: this.item.name, breedId: this.item.breedId } satisfies InquiryState,
    });
  }
}
