import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dog } from '../../../core/models/dog.model';
import { DogService } from '../../../core/services/dog.service';
import { ImageService } from '../../../core/services/image.service';
import { KENNEL_CONFIG } from '../../../core/config/kennel.config';
import { TransformImagePipe } from '../../../shared/pipes/transform-image.pipe';

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
    MatIconModule,
    TransformImagePipe,
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
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" maxlength="200" rows="3"></textarea>
        </mat-form-field>
        <div class="char-counter" [class.char-counter--warn]="isDescriptionNearLimit()">
          {{ descriptionLength() }} / 200
        </div>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="available">Available</mat-option>
            <mat-option value="reserved">Reserved</mat-option>
            <mat-option value="sold">Sold</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="photo-upload">
          <label class="photo-upload__label">Photos</label>
          <button type="button" mat-stroked-button (click)="fileInput.click()" [disabled]="uploadingPhotos()">
            <mat-icon>add_photo_alternate</mat-icon>
            {{ uploadingPhotos() ? 'Uploading...' : 'Add Photos' }}
          </button>
          <input
            #fileInput
            type="file"
            accept="image/*"
            multiple
            hidden
            [disabled]="uploadingPhotos()"
            (change)="onFileSelected($event)"
          />
          @if (photosBase64().length > 0) {
            <div class="photo-grid">
              @for (photo of photosBase64(); track $index; let i = $index) {
                <div class="photo-thumb">
                  <img [src]="photo | transformImage:300" [alt]="'Photo ' + (i + 1)" />
                  <button
                    type="button"
                    mat-icon-button
                    class="photo-thumb__remove"
                    (click)="removePhoto(i)"
                    aria-label="Remove photo"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
            </div>
          }
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
      .char-counter {
        font-size: 12px;
        color: var(--color-text-muted);
        text-align: right;
        margin-top: -0.5rem;
      }
      .char-counter--warn {
        color: var(--mat-sys-error);
      }
      .photo-upload {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
      .photo-upload__label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 8px;
      }
      .photo-thumb {
        position: relative;
      }
      .photo-thumb img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        display: block;
      }
      .photo-thumb__remove {
        position: absolute !important;
        top: -10px !important;
        right: -10px !important;
        width: 24px !important;
        height: 24px !important;
        min-width: unset !important;
        background: rgba(255, 255, 255, 0.95) !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
        padding: 0 !important;
      }
      .photo-thumb__remove mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        line-height: 14px;
      }
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
  photosBase64 = signal<string[]>([]);
  saving = false;
  uploadingPhotos = signal(false);

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
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    status: new FormControl<'available' | 'reserved' | 'sold'>('available', { nonNullable: true }),
  });

  descriptionLength(): number {
    return this.form.controls.description.value.length;
  }

  isDescriptionNearLimit(): boolean {
    return this.descriptionLength() >= 180;
  }

  ngOnInit(): void {
    if (this.data.dog) {
      const { id: _id, createdAt: _ts, photosBase64: _photos, photoBase64: _photo, ...rest } =
        this.data.dog;
      this.form.patchValue(rest);
      if (this.data.dog.photosBase64?.length) {
        this.photosBase64.set([...this.data.dog.photosBase64]);
      } else if (this.data.dog.photoBase64) {
        this.photosBase64.set([this.data.dog.photoBase64]);
      }
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);

    this.uploadingPhotos.set(true);
    try {
      const results = await Promise.allSettled(files.map(f => this.imageService.uploadImage(f)));

      for (const result of results) {
        if (result.status === 'rejected') {
          this.snackBar.open('Failed to upload one or more photos', 'OK', { duration: 3000 });
        } else {
          this.photosBase64.update(photos => [...photos, result.value]);
        }
      }
    } finally {
      this.uploadingPhotos.set(false);
      input.value = '';
    }
  }

  removePhoto(index: number): void {
    this.photosBase64.update(photos => photos.filter((_, i) => i !== index));
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const dogData = {
      ...raw,
      photosBase64: this.photosBase64(),
      createdAt: this.data.dog?.createdAt ?? Date.now(),
    };

    const op = this.data.dog?.id
      ? this.dogService.updateDog(this.data.dog.id, dogData)
      : this.dogService.addDog(dogData);

    op.then(() => this.dialogRef.close(true)).catch(() => {
      this.saving = false;
    });
  }
}
