import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Dog } from '../../../core/models/dog.model';
import { DogService } from '../../../core/services/dog.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';
import { AdminDogDialog } from './admin-dog-dialog.component';
import { TransformImagePipe } from '../../../shared/pipes/transform-image.pipe';

@Component({
  selector: 'app-admin-dogs',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    TransformImagePipe,
  ],
  templateUrl: './admin-dogs.component.html',
  styleUrl: './admin-dogs.component.scss',
})
export class AdminDogs implements OnInit {
  private dogService = inject(DogService);
  private dialog = inject(MatDialog);

  breeds = KENNEL_CONFIG.breeds;
  displayedColumns = ['photo', 'name', 'breed', 'gender', 'dateOfBirth', 'color', 'titles', 'status', 'actions'];

  filterForm = new FormGroup({
    breed: new FormControl<string>('', { nonNullable: true }),
    gender: new FormControl<string>('', { nonNullable: true }),
  });

  private breedFilter$ = new BehaviorSubject<string>('');
  private genderFilter$ = new BehaviorSubject<string>('');

  filteredDogs$!: Observable<Dog[]>;

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(v => {
      this.breedFilter$.next(v.breed ?? '');
      this.genderFilter$.next(v.gender ?? '');
    });

    this.filteredDogs$ = combineLatest([
      this.dogService.getAllDogs(),
      this.breedFilter$,
      this.genderFilter$,
    ]).pipe(
      map(([dogs, breed, gender]) =>
        dogs.filter(
          d =>
            (!breed || d.breedId === breed) &&
            (!gender || d.gender === gender)
        )
      )
    );
  }

  getBreedName(breedId: string): string {
    return this.breeds.find(b => b.id === breedId)?.name ?? breedId;
  }

  openDialog(dog?: Dog): void {
    const ref = this.dialog.open(AdminDogDialog, {
      data: { dog },
      width: '480px',
    });
    ref.afterClosed().subscribe(result => {
      // table auto-updates via observable
    });
  }

  deleteDog(dog: Dog): void {
    if (!dog.id || !confirm(`Delete ${dog.name}?`)) return;
    this.dogService.deleteDog(dog.id);
  }
}
