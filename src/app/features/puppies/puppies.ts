import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { KENNEL_CONFIG } from '../../core/config/kennel.config';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { DogProfileCard } from '../../shared/components/dog-profile-card/dog-profile-card';
import { PuppyService } from '../../core/services/puppy.service';
import { Puppy } from '../../core/models/puppy.model';
import { ProfileCardItem } from '../../shared/models/profile-card.model';
import {
  DogDetailModal,
  DogDetailModalData,
} from '../../shared/components/dog-detail-modal/dog-detail-modal.component';

function getPhotos(puppy: Puppy): string[] {
  if (puppy.photosBase64?.length) return puppy.photosBase64;
  if (puppy.photoBase64) return [puppy.photoBase64];
  return [];
}

function puppyToProfileCard(puppy: Puppy): ProfileCardItem {
  const photos = getPhotos(puppy);
  return {
    name: puppy.name,
    photoUrl: photos[0] ?? '',
    photosBase64: photos,
    color: puppy.color,
    dateOfBirth: puppy.dateOfBirth,
    status: puppy.status,
    gender: puppy.gender,
  };
}

@Component({
  selector: 'app-puppies',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, SectionHeader, DogProfileCard],
  templateUrl: './puppies.html',
  styleUrl: './puppies.scss',
})
export class Puppies {
  private puppyService = inject(PuppyService);
  private dialog = inject(MatDialog);

  breeds = KENNEL_CONFIG.breeds;
  activeBreed = signal<string | null>(null);

  private allPuppies = toSignal(this.puppyService.getAllPuppies(), { initialValue: [] });

  flatItems = computed<ProfileCardItem[]>(() => {
    const b = this.activeBreed();
    const puppies = b
      ? this.allPuppies().filter(p => p.breedId === b)
      : this.allPuppies();
    return puppies.map(puppyToProfileCard);
  });

  groupedSections = computed(() => {
    const all = this.allPuppies();
    return KENNEL_CONFIG.breeds
      .map(breed => ({
        breed,
        items: all.filter(p => p.breedId === breed.id).map(puppyToProfileCard),
      }))
      .filter(g => g.items.length > 0);
  });

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeBreed.set(params['breed'] ?? null);
    });
  }

  getBreedName(breedId: string): string {
    return KENNEL_CONFIG.breeds.find(b => b.id === breedId)?.name ?? breedId;
  }

  openModal(items: ProfileCardItem[], index: number): void {
    const data: DogDetailModalData = { items, currentIndex: index };
    this.dialog.open(DogDetailModal, { data, panelClass: 'profile-modal-panel' });
  }
}
