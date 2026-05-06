import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { SectionHeader } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgFor, NgIf, SectionHeader],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  breeds = KENNEL_CONFIG.breeds;
  activeBreed = signal<string | null>(null);

  records = [
    { id: 1, breed: 'bernese-mountain-dog', breedName: 'Bernese Mountain Dog', litter: 'Z', year: 2023, puppyCount: 6 },
    { id: 2, breed: 'maltese', breedName: 'Maltese', litter: 'Y', year: 2023, puppyCount: 4 },
    { id: 3, breed: 'bernese-mountain-dog', breedName: 'Bernese Mountain Dog', litter: 'X', year: 2022, puppyCount: 7 },
    { id: 4, breed: 'bolonka-zwetna', breedName: 'Bolonka Zwetna', litter: 'W', year: 2022, puppyCount: 3 },
  ];

  filtered = computed(() => {
    const b = this.activeBreed();
    return b ? this.records.filter(r => r.breed === b) : this.records;
  });

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeBreed.set(params['breed'] ?? null);
    });
  }
}
