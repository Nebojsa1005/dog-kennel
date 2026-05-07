import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Litter } from '../../../core/models/litter.model';
import { LitterService } from '../../../core/services/litter.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';
import { AdminLitterDialog } from './admin-litter-dialog.component';

@Component({
  selector: 'app-admin-litters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './admin-litters.component.html',
  styleUrl: './admin-litters.component.scss',
})
export class AdminLitters implements OnInit {
  private litterService = inject(LitterService);
  private dialog = inject(MatDialog);

  breeds = KENNEL_CONFIG.breeds;
  displayedColumns = ['name', 'breed', 'dateOfBirth', 'motherName', 'fatherName', 'status', 'actions'];

  filterForm = new FormGroup({
    breed: new FormControl<string>('', { nonNullable: true }),
  });

  private breedFilter$ = new BehaviorSubject<string>('');
  filteredLitters$!: Observable<Litter[]>;

  ngOnInit(): void {
    this.filterForm.controls.breed.valueChanges.subscribe(v => this.breedFilter$.next(v));

    this.filteredLitters$ = combineLatest([
      this.litterService.getAllLitters(),
      this.breedFilter$,
    ]).pipe(
      map(([litters, breed]) => litters.filter(l => !breed || l.breedId === breed))
    );
  }

  getBreedName(breedId: string): string {
    return this.breeds.find(b => b.id === breedId)?.name ?? breedId;
  }

  openDialog(litter?: Litter): void {
    this.dialog.open(AdminLitterDialog, { data: { litter }, width: '480px' });
  }

  deleteLitter(litter: Litter): void {
    if (!litter.id || !confirm(`Delete ${litter.name}?`)) return;
    this.litterService.deleteLitter(litter.id);
  }
}
