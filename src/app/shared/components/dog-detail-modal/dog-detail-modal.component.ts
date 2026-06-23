import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DogImg } from '../dog-img/dog-img';
import { ProfileCardItem } from '../../models/profile-card.model';
import { register } from 'swiper/element/bundle';

register();

export interface DogDetailModalData {
  items: ProfileCardItem[];
  currentIndex: number;
}

interface SwiperElement extends HTMLElement {
  swiper: { slideTo: (index: number, speed?: number) => void };
}

@Component({
  selector: 'app-dog-detail-modal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatDialogModule, MatButtonModule, DatePipe, NgIf, TitleCasePipe, DogImg],
  templateUrl: './dog-detail-modal.component.html',
  styleUrl: './dog-detail-modal.component.scss',
})
export class DogDetailModal {
  private dialogRef = inject(MatDialogRef<DogDetailModal>);
  private data = inject<DogDetailModalData>(MAT_DIALOG_DATA);

  @ViewChild('swiperEl') swiperEl?: ElementRef<SwiperElement>;

  readonly items = this.data.items;
  readonly currentIndex = signal(this.data.currentIndex);

  get item(): ProfileCardItem {
    return this.items[this.currentIndex()];
  }

  get hasPrev(): boolean {
    return this.currentIndex() > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex() < this.items.length - 1;
  }

  prev(): void {
    if (this.hasPrev) {
      this.currentIndex.update(i => i - 1);
      this.resetSwiper();
    }
  }

  next(): void {
    if (this.hasNext) {
      this.currentIndex.update(i => i + 1);
      this.resetSwiper();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private resetSwiper(): void {
    setTimeout(() => this.swiperEl?.nativeElement?.swiper?.slideTo(0, 0), 0);
  }
}
