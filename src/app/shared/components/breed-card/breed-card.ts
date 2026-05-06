import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DogImg } from '../dog-img/dog-img';
import { type Breed } from '../../../core/config/kennel.config';

@Component({
  selector: 'app-breed-card',
  standalone: true,
  imports: [RouterLink, TranslateModule, DogImg],
  templateUrl: './breed-card.html',
  styleUrl: './breed-card.scss',
})
export class BreedCard {
  @Input({ required: true }) breed!: Breed;
}
