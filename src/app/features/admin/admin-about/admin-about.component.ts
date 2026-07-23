import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { take } from 'rxjs/operators';
import { AboutImage, AboutStats } from '../../../core/models/about.model';
import { AboutService } from '../../../core/services/about.service';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DragDropModule,
  ],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.scss',
})
export class AdminAbout implements OnInit {
  private aboutService = inject(AboutService);
  private imageService = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  savingText = signal(false);
  savingImages = signal(false);
  savingStats = signal(false);

  images = signal<AboutImage[]>([]);

  textForm = new FormGroup({
    text: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  statsForm = new FormGroup({
    years: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    litters: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    puppies: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    countries: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.aboutService
      .getText()
      .pipe(take(1))
      .subscribe(text => this.textForm.patchValue({ text }));
    this.aboutService
      .getImages()
      .pipe(take(1))
      .subscribe(images => this.images.set(images));
    this.aboutService
      .getStats()
      .pipe(take(1))
      .subscribe(stats => this.statsForm.patchValue(stats));
  }

  saveText(): void {
    if (this.textForm.invalid) return;
    this.savingText.set(true);
    this.aboutService
      .setText(this.textForm.getRawValue().text)
      .then(() => this.snackBar.open('About text saved', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Failed to save text', 'OK', { duration: 3000 }))
      .finally(() => this.savingText.set(false));
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);

    const results = await Promise.allSettled(
      files.map(f => this.imageService.compressAndConvert(f))
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.snackBar.open('Failed to process one or more images', 'OK', { duration: 3000 });
      } else {
        if (!this.imageService.validateSize(result.value)) {
          this.snackBar.open('One or more images are too large', 'OK', { duration: 4000 });
        }
        this.images.update(images => [...images, { url: result.value }]);
      }
    }

    input.value = '';
  }

  removeImage(index: number): void {
    this.images.update(images => images.filter((_, i) => i !== index));
  }

  dropImage(event: CdkDragDrop<AboutImage[]>): void {
    const arr = [...this.images()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.images.set(arr);
  }

  saveImages(): void {
    this.savingImages.set(true);
    this.aboutService
      .setImages(this.images())
      .then(() => this.snackBar.open('About images saved', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Failed to save images', 'OK', { duration: 3000 }))
      .finally(() => this.savingImages.set(false));
  }

  saveStats(): void {
    if (this.statsForm.invalid) return;
    this.savingStats.set(true);
    const stats: AboutStats = this.statsForm.getRawValue();
    this.aboutService
      .setStats(stats)
      .then(() => this.snackBar.open('Stats saved', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Failed to save stats', 'OK', { duration: 3000 }))
      .finally(() => this.savingStats.set(false));
  }
}
