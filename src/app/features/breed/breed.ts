import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { KENNEL_CONFIG, type Breed as BreedModel } from '../../core/config/kennel.config';
import { DogImg } from '../../shared/components/dog-img/dog-img';

@Component({
  selector: 'app-breed',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslateModule, NgIf, DogImg],
  templateUrl: './breed.html',
  styleUrl: './breed.scss',
})
export class Breed {
  breed = signal<BreedModel | undefined>(undefined);

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const found = KENNEL_CONFIG.breeds.find(b => b.id === params['id']);
      this.breed.set(found);
    });
  }
}
