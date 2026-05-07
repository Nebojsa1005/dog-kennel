import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs/operators';
import { BreedData } from '../../../core/models/breed.model';
import { BreedService } from '../../../core/services/breed.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';

interface BreedEditState {
  expanded: boolean;
  saving: boolean;
  data: BreedData | null;
  form: FormGroup;
}

@Component({
  selector: 'app-admin-breeds',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-breeds.component.html',
  styleUrl: './admin-breeds.component.scss',
})
export class AdminBreeds implements OnInit {
  private breedService = inject(BreedService);

  breedConfigs = KENNEL_CONFIG.breeds;
  breedStates: Record<string, BreedEditState> = {};

  ngOnInit(): void {
    for (const b of this.breedConfigs) {
      this.breedStates[b.id] = {
        expanded: false,
        saving: false,
        data: null,
        form: new FormGroup({
          about: new FormControl<string>('', { nonNullable: true }),
          appearance: new FormControl<string>('', { nonNullable: true }),
          size: new FormControl<string>('', { nonNullable: true }),
          weight: new FormControl<string>('', { nonNullable: true }),
          coat: new FormControl<string>('', { nonNullable: true }),
          colors: new FormControl<string>('', { nonNullable: true }),
        }),
      };
    }

    this.breedService.getBreeds().pipe(take(1)).subscribe(breeds => {
      for (const breed of breeds) {
        if (breed.id && this.breedStates[breed.id]) {
          this.breedStates[breed.id].data = breed;
          this.breedStates[breed.id].form.patchValue({
            about: breed.about,
            appearance: breed.standards?.appearance ?? '',
            size: breed.standards?.size ?? '',
            weight: breed.standards?.weight ?? '',
            coat: breed.standards?.coat ?? '',
            colors: breed.standards?.colors ?? '',
          });
        }
      }
    });
  }

  toggle(breedId: string): void {
    this.breedStates[breedId].expanded = !this.breedStates[breedId].expanded;
  }

  save(breedId: string): void {
    const state = this.breedStates[breedId];
    state.saving = true;
    const raw = state.form.getRawValue() as {
      about: string;
      appearance: string;
      size: string;
      weight: string;
      coat: string;
      colors: string;
    };
    const data: BreedData = {
      about: raw.about,
      standards: {
        appearance: raw.appearance,
        size: raw.size,
        weight: raw.weight,
        coat: raw.coat,
        colors: raw.colors,
      },
    };
    this.breedService
      .setBreed(breedId, data)
      .then(() => {
        state.saving = false;
        state.data = data;
      })
      .catch(() => {
        state.saving = false;
      });
  }
}
