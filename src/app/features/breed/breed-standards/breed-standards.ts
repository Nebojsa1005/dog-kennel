import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { KENNEL_CONFIG, type Breed } from '../../../core/config/kennel.config';
import { BreedService } from '../../../core/services/breed.service';
import { BreedData } from '../../../core/models/breed.model';

@Component({
  selector: 'app-breed-standards',
  standalone: true,
  imports: [TranslateModule, NgIf],
  templateUrl: './breed-standards.html',
  styleUrl: './breed-standards.scss',
})
export class BreedStandards {
  private breedService = inject(BreedService);

  breed = signal<Breed | undefined>(undefined);
  breedContent = signal<BreedData | null>(null);

  constructor(private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.breed.set(KENNEL_CONFIG.breeds.find(b => b.id === params['id']));
    });

    this.route.parent?.params
      .pipe(switchMap(params => this.breedService.getBreed(params['id'])))
      .subscribe(data => this.breedContent.set(data));
  }
}
