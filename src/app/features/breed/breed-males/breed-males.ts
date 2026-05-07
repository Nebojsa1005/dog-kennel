import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { KENNEL_CONFIG, type Breed } from '../../../core/config/kennel.config';
import { DogService } from '../../../core/services/dog.service';
import { Dog } from '../../../core/models/dog.model';
import { ProfileCardItem } from '../../../shared/models/profile-card.model';
import { DogProfileCard } from '../../../shared/components/dog-profile-card/dog-profile-card';
import { SectionHeader } from '../../../shared/components/section-header/section-header';
import {
  DogDetailModal,
  DogDetailModalData,
} from '../../../shared/components/dog-detail-modal/dog-detail-modal.component';

function dogToProfileCard(dog: Dog): ProfileCardItem {
  return {
    name: dog.name,
    photoUrl: dog.photoBase64,
    color: dog.color,
    dateOfBirth: dog.dateOfBirth,
    status: dog.status,
    titles: dog.titles,
    gender: dog.gender,
  };
}

@Component({
  selector: 'app-breed-males',
  standalone: true,
  imports: [NgFor, NgIf, DogProfileCard, SectionHeader],
  templateUrl: './breed-males.html',
  styleUrl: './breed-males.scss',
})
export class BreedMales {
  private dogService = inject(DogService);
  private dialog = inject(MatDialog);

  breed = signal<Breed | undefined>(undefined);
  dogs = signal<Dog[]>([]);

  profileItems = computed(() => this.dogs().map(dogToProfileCard));

  constructor(private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.breed.set(KENNEL_CONFIG.breeds.find(b => b.id === params['id']));
    });

    this.route.parent?.params
      .pipe(
        switchMap(params =>
          params['id'] ? this.dogService.getDogsByBreed(params['id'], 'male') : EMPTY
        )
      )
      .subscribe(dogs => this.dogs.set(dogs));
  }

  openModal(index: number): void {
    const data: DogDetailModalData = { items: this.profileItems(), currentIndex: index };
    this.dialog.open(DogDetailModal, { data, panelClass: 'profile-modal-panel' });
  }
}
