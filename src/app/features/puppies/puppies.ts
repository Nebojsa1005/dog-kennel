import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { DogImg } from '../../shared/components/dog-img/dog-img';
import { Badge } from '../../shared/components/badge/badge';
import { SectionHeader } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-puppies',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgFor, DogImg, Badge, SectionHeader],
  templateUrl: './puppies.html',
  styleUrl: './puppies.scss',
})
export class Puppies {
  breeds = KENNEL_CONFIG.breeds;
  activeBreed = signal<string | null>(null);

  allPuppies = [
    { id: 1, breed: 'bernese-mountain-dog', breedName: 'Bernese Mountain Dog', litter: 'A', born: '2025-03-01', availableFrom: '2025-05-01', status: 'available' as const },
    { id: 2, breed: 'maltese', breedName: 'Maltese', litter: 'B', born: '2025-02-15', availableFrom: '2025-04-15', status: 'reserved' as const },
    { id: 3, breed: 'bolonka-zwetna', breedName: 'Bolonka Zwetna', litter: 'C', born: '2025-04-01', availableFrom: '2025-06-01', status: 'available' as const },
    { id: 4, breed: 'bernese-mountain-dog', breedName: 'Bernese Mountain Dog', litter: 'D', born: '2025-04-10', availableFrom: '2025-06-10', status: 'available' as const },
  ];

  filtered = computed(() => {
    const b = this.activeBreed();
    return b ? this.allPuppies.filter(p => p.breed === b) : this.allPuppies;
  });

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeBreed.set(params['breed'] ?? null);
    });
  }
}
