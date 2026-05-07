import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { LitterService } from '../../core/services/litter.service';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgFor, NgIf, SectionHeader],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  private litterService = inject(LitterService);

  breeds = KENNEL_CONFIG.breeds;
  activeBreed = signal<string | null>(null);

  private allLitters = toSignal(this.litterService.getAllLitters(), { initialValue: [] });

  filtered = computed(() => {
    const b = this.activeBreed();
    return b ? this.allLitters().filter(l => l.breedId === b) : this.allLitters();
  });

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeBreed.set(params['breed'] ?? null);
    });
  }

  getBreedName(breedId: string): string {
    return KENNEL_CONFIG.breeds.find(b => b.id === breedId)?.name ?? breedId;
  }
}
