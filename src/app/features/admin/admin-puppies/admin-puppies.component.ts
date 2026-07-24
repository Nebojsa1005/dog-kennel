import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Puppy } from '../../../core/models/puppy.model';
import { Litter } from '../../../core/models/litter.model';
import { PuppyService } from '../../../core/services/puppy.service';
import { LitterService } from '../../../core/services/litter.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';
import { AdminPuppyDialog } from './admin-puppy-dialog.component';
import { TransformImagePipe } from '../../../shared/pipes/transform-image.pipe';

@Component({
  selector: 'app-admin-puppies',
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
  templateUrl: './admin-puppies.component.html',
  styleUrl: './admin-puppies.component.scss',
})
export class AdminPuppies implements OnInit {
  private puppyService = inject(PuppyService);
  private litterService = inject(LitterService);
  private dialog = inject(MatDialog);

  breeds = KENNEL_CONFIG.breeds;
  litters: Litter[] = [];
  displayedColumns = ['photo', 'name', 'breed', 'litter', 'gender', 'dateOfBirth', 'color', 'status', 'actions'];

  filterForm = new FormGroup({
    breed: new FormControl<string>('', { nonNullable: true }),
    litter: new FormControl<string>('', { nonNullable: true }),
  });

  private breedFilter$ = new BehaviorSubject<string>('');
  private litterFilter$ = new BehaviorSubject<string>('');
  filteredPuppies$!: Observable<Puppy[]>;

  ngOnInit(): void {
    this.litterService.getAllLitters().subscribe(l => (this.litters = l));

    this.filterForm.valueChanges.subscribe(v => {
      this.breedFilter$.next(v.breed ?? '');
      this.litterFilter$.next(v.litter ?? '');
    });

    this.filteredPuppies$ = combineLatest([
      this.puppyService.getAllPuppies(),
      this.breedFilter$,
      this.litterFilter$,
    ]).pipe(
      map(([puppies, breed, litter]) =>
        puppies.filter(
          p => (!breed || p.breedId === breed) && (!litter || p.litterId === litter)
        )
      )
    );
  }

  getBreedName(breedId: string): string {
    return this.breeds.find(b => b.id === breedId)?.name ?? breedId;
  }

  getLitterName(litterId: string): string {
    return this.litters.find(l => l.id === litterId)?.name ?? litterId;
  }

  openDialog(puppy?: Puppy): void {
    this.dialog.open(AdminPuppyDialog, { data: { puppy }, width: '480px' });
  }

  deletePuppy(puppy: Puppy): void {
    if (!puppy.id || !confirm(`Delete ${puppy.name}?`)) return;
    this.puppyService.deletePuppy(puppy.id);
  }
}
