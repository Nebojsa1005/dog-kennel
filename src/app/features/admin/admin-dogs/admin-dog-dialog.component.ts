import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Dog } from '../../../core/models/dog.model';
import { DogService } from '../../../core/services/dog.service';
import { ImageService } from '../../../core/services/image.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';

export interface DogDialogData {
  dog?: Dog;
}

@Component({
  selector: 'app-admin-dog-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.dog ? 'Edit Dog' : 'Add Dog' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dog-form">
        <mat-form-field>
          <mat-label>Breed</mat-label>
          <mat-select formControlName="breedId">
            @for (b of breeds; track b.id) {
              <mat-option [value]="b.id">{{ b.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Gender</mat-label>
          <mat-select formControlName="gender">
            <mat-option value="male">Male</mat-option>
            <mat-option value="female">Female</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date of Birth (YYYY-MM-DD)</mat-label>
          <input matInput formControlName="dateOfBirth" placeholder="2023-01-15" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Color</mat-label>
          <input matInput formControlName="color" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Titles</mat-label>
          <input matInput formControlName="titles" />
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
      .dog-form {
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
export class AdminDogDialog implements OnInit {
  readonly data: DogDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AdminDogDialog>);
  private dogService = inject(DogService);
  private imageService = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  breeds = KENNEL_CONFIG.breeds;
  photoBase64 = '';
  saving = false;

  form = new FormGroup({
    breedId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl<'male' | 'female'>('male', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    dateOfBirth: new FormControl<string>('', { nonNullable: true }),
    color: new FormControl<string>('', { nonNullable: true }),
    titles: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<'available' | 'reserved' | 'sold'>('available', { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.data.dog) {
      const { id: _id, createdAt: _ts, photoBase64: _photo, ...rest } = this.data.dog;
      this.form.patchValue(rest);
      this.photoBase64 = this.data.dog.photoBase64 ?? '';
    }
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
    const dogData = { ...raw, photoBase64: this.photoBase64, createdAt: this.data.dog?.createdAt ?? Date.now() };

    const op = this.data.dog?.id
      ? this.dogService.updateDog(this.data.dog.id, dogData)
      : this.dogService.addDog(dogData);

    op.then(() => this.dialogRef.close(true)).catch(() => { this.saving = false; });
  }
}
