import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { take } from 'rxjs/operators';
import { Puppy } from '../../../core/models/puppy.model';
import { Litter } from '../../../core/models/litter.model';
import { PuppyService } from '../../../core/services/puppy.service';
import { LitterService } from '../../../core/services/litter.service';
import { ImageService } from '../../../core/services/image.service';
import { TransformImagePipe } from '../../../shared/pipes/transform-image.pipe';
import {
  DdMmYyyyDateAdapter,
  DD_MM_YYYY_FORMATS,
} from '../../../shared/date-adapter/dd-mm-yyyy-date-adapter';
import { isoStringToDate, dateToIsoString } from '../../../shared/date-adapter/date-string.util';

export interface PuppyDialogData {
  puppy?: Puppy;
}

@Component({
  selector: 'app-admin-puppy-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    TransformImagePipe,
  ],
  providers: [
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
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
          <mat-label>Color</mat-label>
          <input matInput formControlName="color" />
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
      .dialog-form {
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
export class AdminPuppyDialog implements OnInit {
  readonly data: PuppyDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AdminPuppyDialog>);
  private puppyService = inject(PuppyService);
  private litterService = inject(LitterService);
  private imageService = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  litters: Litter[] = [];
  photosBase64 = signal<string[]>([]);
  saving = false;
  uploadingPhotos = signal(false);

  form = new FormGroup({
    litterId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    breedId: new FormControl<string>('', { nonNullable: true }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl<'male' | 'female'>('male', { nonNullable: true }),
    dateOfBirth: new FormControl<Date | null>(null),
    color: new FormControl<string>('', { nonNullable: true }),
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
    this.litterService.getAllLitters().pipe(take(1)).subscribe(litters => {
      this.litters = litters;
    });

    if (this.data.puppy) {
      const { id: _id, createdAt: _ts, photosBase64: _photos, photoBase64: _photo, ...rest } =
        this.data.puppy;
      this.form.patchValue({ ...rest, dateOfBirth: isoStringToDate(rest.dateOfBirth) });
      if (this.data.puppy.photosBase64?.length) {
        this.photosBase64.set([...this.data.puppy.photosBase64]);
      } else if (this.data.puppy.photoBase64) {
        this.photosBase64.set([this.data.puppy.photoBase64]);
      }
    }
  }

  onLitterChange(litterId: string): void {
    const litter = this.litters.find(l => l.id === litterId);
    if (litter) this.form.patchValue({ breedId: litter.breedId });
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
    const puppyData = {
      ...raw,
      dateOfBirth: dateToIsoString(raw.dateOfBirth),
      photosBase64: this.photosBase64(),
      createdAt: this.data.puppy?.createdAt ?? Date.now(),
    };

    const op = this.data.puppy?.id
      ? this.puppyService.updatePuppy(this.data.puppy.id, puppyData)
      : this.puppyService.addPuppy(puppyData);

    op.then(() => this.dialogRef.close(true)).catch(() => {
      this.saving = false;
    });
  }
}
