import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { Puppy } from '../../../core/models/puppy.model';
import { Litter } from '../../../core/models/litter.model';
import { PuppyService } from '../../../core/services/puppy.service';
import { LitterService } from '../../../core/services/litter.service';
import { ImageService } from '../../../core/services/image.service';

export interface PuppyDialogData {
  puppy?: Puppy;
}

@Component({
  selector: 'app-admin-puppy-dialog',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.puppy ? 'Edit Puppy' : 'Add Puppy' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field>
          <mat-label>Litter</mat-label>
          <mat-select formControlName="litterId" (selectionChange)="onLitterChange($event.value)">
            @for (l of litters; track l.id) {
              <mat-option [value]="l.id">{{ l.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Gender</mat-label>
          <mat-select formControlName="gender">
            <mat-option value="male">Male</mat-option>
            <mat-option value="female">Female</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date of Birth (YYYY-MM-DD)</mat-label>
          <input matInput formControlName="dateOfBirth" placeholder="2025-01-10" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Color</mat-label>
          <input matInput formControlName="color" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="available">Available</mat-option>
            <mat-option value="reserved">Reserved</mat-option>
            <mat-option value="sold">Sold</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="photo-upload">
          <label>Photo</label>
          <input type="file" accept="image/*" (change)="onFileSelected($event)" />
          <img *ngIf="photoBase64" [src]="photoBase64" class="photo-preview" alt="preview" />
        </div>
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
      .photo-upload { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
      .photo-preview { max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 4px; }
    `,
  ],
})
export class AdminPuppyDialog implements OnInit {
  readonly data: PuppyDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AdminPuppyDialog>);
  private puppyService = inject(PuppyService);
  private litterService = inject(LitterService);
  private imageService = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  litters: Litter[] = [];
  photoBase64 = '';
  saving = false;

  form = new FormGroup({
    litterId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    breedId: new FormControl<string>('', { nonNullable: true }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl<'male' | 'female'>('male', { nonNullable: true }),
    dateOfBirth: new FormControl<string>('', { nonNullable: true }),
    color: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<'available' | 'reserved' | 'sold'>('available', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.litterService.getAllLitters().pipe(take(1)).subscribe(litters => {
      this.litters = litters;
    });

    if (this.data.puppy) {
      const { id: _id, createdAt: _ts, photoBase64: _photo, ...rest } = this.data.puppy;
      this.form.patchValue(rest);
      this.photoBase64 = this.data.puppy.photoBase64 ?? '';
    }
  }

  onLitterChange(litterId: string): void {
    const litter = this.litters.find(l => l.id === litterId);
    if (litter) this.form.patchValue({ breedId: litter.breedId });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    try {
      const base64 = await this.imageService.compressAndConvert(input.files[0]);
      this.photoBase64 = base64;
      if (!this.imageService.validateSize(base64)) {
        this.snackBar.open('Image is too large, please use a smaller photo', 'OK', { duration: 4000 });
      }
    } catch {
      this.snackBar.open('Failed to process image', 'OK', { duration: 3000 });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const puppyData = { ...raw, photoBase64: this.photoBase64, createdAt: this.data.puppy?.createdAt ?? Date.now() };

    const op = this.data.puppy?.id
      ? this.puppyService.updatePuppy(this.data.puppy.id, puppyData)
      : this.puppyService.addPuppy(puppyData);

    op.then(() => this.dialogRef.close(true)).catch(() => { this.saving = false; });
  }
}
