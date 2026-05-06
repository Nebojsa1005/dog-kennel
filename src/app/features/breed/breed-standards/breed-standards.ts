import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KENNEL_CONFIG, type Breed } from '../../../core/config/kennel.config';

@Component({
  selector: 'app-breed-standards',
  standalone: true,
  imports: [TranslateModule, NgIf],
  templateUrl: './breed-standards.html',
  styleUrl: './breed-standards.scss',
})
export class BreedStandards {
  breed = signal<Breed | undefined>(undefined);

  constructor(private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.breed.set(KENNEL_CONFIG.breeds.find(b => b.id === params['id']));
    });
  }
}
