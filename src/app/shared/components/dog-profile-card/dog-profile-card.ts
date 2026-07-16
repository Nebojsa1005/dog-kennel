import { Component, Input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DogImg } from '../dog-img/dog-img';
import { ProfileCardItem } from '../../models/profile-card.model';

@Component({
  selector: 'app-dog-profile-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, DogImg],
  templateUrl: './dog-profile-card.html',
  styleUrl: './dog-profile-card.scss',
})
export class DogProfileCard {
  @Input() item!: ProfileCardItem;
}
