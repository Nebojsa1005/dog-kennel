import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Litter } from '../../../core/models/litter.model';
import { LitterService } from '../../../core/services/litter.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';
import {
  DdMmYyyyDateAdapter,
  DD_MM_YYYY_FORMATS,
} from '../../../shared/date-adapter/dd-mm-yyyy-date-adapter';
import { isoStringToDate, dateToIsoString } from '../../../shared/date-adapter/date-string.util';

export interface LitterDialogData {
  litter?: Litter;
}

@Component({
  selector: 'app-admin-litter-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  template: `
    <h2 mat-dialog-title>{{ data.litter ? 'Edit Litter' : 'Add Litter' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Breed</mat-label>
          <mat-select formControlName="breedId">
            @for (b of breeds; track b.id) {
              <mat-option [value]="b.id">{{ b.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Litter Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date of Birth</mat-label>
          <input
            matInput
            [matDatepicker]="dobPicker"
            formControlName="dateOfBirth"
            readonly
            (click)="dobPicker.open()"
          />
          <mat-datepicker #dobPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Mother Name</mat-label>
          <input matInput formControlName="motherName" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Father Name</mat-label>
          <input matInput formControlName="fatherName" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="available">Available</mat-option>
            <mat-option value="reserved">Reserved</mat-option>
            <mat-option value="sold">Sold</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 360px;
        padding-top: 0.5rem;
      }
      mat-form-field { width: 100%; }
    `,
  ],
})
export class AdminLitterDialog implements OnInit {
  readonly data: LitterDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AdminLitterDialog>);
  private litterService = inject(LitterService);

  breeds = KENNEL_CONFIG.breeds;
  saving = false;

  form = new FormGroup({
    breedId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    dateOfBirth: new FormControl<Date | null>(null),
    motherName: new FormControl<string>('', { nonNullable: true }),
    fatherName: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<'available' | 'reserved' | 'sold'>('available', { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.data.litter) {
      const { id: _id, createdAt: _ts, ...rest } = this.data.litter;
      this.form.patchValue({ ...rest, dateOfBirth: isoStringToDate(rest.dateOfBirth) });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const litterData = {
      ...raw,
      dateOfBirth: dateToIsoString(raw.dateOfBirth),
      createdAt: this.data.litter?.createdAt ?? Date.now(),
    };

    const op = this.data.litter?.id
      ? this.litterService.updateLitter(this.data.litter.id, litterData)
      : this.litterService.addLitter(litterData);

    op.then(() => this.dialogRef.close(true)).catch(() => {
      this.saving = false;
    });
  }
}
