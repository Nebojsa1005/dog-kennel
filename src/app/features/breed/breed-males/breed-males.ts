import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { KENNEL_CONFIG, type Breed } from '../../../core/config/kennel.config';
import { DogImg } from '../../../shared/components/dog-img/dog-img';

@Component({
  selector: 'app-breed-males',
  standalone: true,
  imports: [TranslateModule, NgIf],
  templateUrl: './breed-males.html',
  styleUrl: './breed-males.scss',
})
export class BreedMales {
  breed = signal<Breed | undefined>(undefined);

  constructor(private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.breed.set(KENNEL_CONFIG.breeds.find(b => b.id === params['id']));
    });
  }
}
