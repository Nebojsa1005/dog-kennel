import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StarRating } from '../../../shared/components/star-rating/star-rating';
import { GuestbookService } from '../../../core/services/guestbook.service';
import { ImageService } from '../../../core/services/image.service';
import { GuestbookEntry } from '../../../core/models/guestbook-entry.model';
import { TransformImagePipe } from '../../../shared/pipes/transform-image.pipe';

@Component({
  selector: 'app-guestbook-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgIf,
    MatProgressSpinnerModule,
    StarRating,
    TransformImagePipe,
  ],
  templateUrl: './guestbook-form.html',
  styleUrl: './guestbook-form.scss',
})
export class GuestbookForm {
  private guestbookService = inject(GuestbookService);
  private imageService = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  imageBase64 = signal<string | null>(null);
  uploadingImage = signal(false);
  rating = signal(0);
  ratingTouched = signal(false);
  isLoading = signal(false);
  isSuccess = signal(false);
  isError = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onRatingChange(star: number): void {
    this.rating.set(star);
    this.ratingTouched.set(true);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    this.uploadingImage.set(true);
    try {
      const url = await this.imageService.uploadImage(file);
      this.imageBase64.set(url);
    } catch {
      this.snackBar.open('Failed to upload image', 'OK', { duration: 3000 });
    } finally {
      this.uploadingImage.set(false);
      input.value = '';
    }
  }

  removeImage(): void {
    this.imageBase64.set(null);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.ratingTouched.set(true);
    console.log(this.form.invalid);
    console.log(this.rating());

    if (this.form.invalid || this.rating() < 1) return;

    this.isLoading.set(true);
    this.isSuccess.set(false);
    this.isError.set(false);

    try {
      const { name, message } = this.form.value;
      const image = this.imageBase64();
      const entry: Omit<GuestbookEntry, 'id'> = {
        name,
        message,
        rating: this.rating(),
        createdAt: Date.now(),
        ...(image ? { imageBase64: image } : {}),
      };

      console.log({entry});
      
      await this.guestbookService.addEntry(entry);
      this.form.reset();
      this.rating.set(0);
      this.ratingTouched.set(false);
      this.imageBase64.set(null);
      this.isSuccess.set(true);
    }  finally {
      this.isLoading.set(false);
    }
  }
}
