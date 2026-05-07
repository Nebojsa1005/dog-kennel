import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DogImg } from '../dog-img/dog-img';
import { ProfileCardItem } from '../../models/profile-card.model';

export interface DogDetailModalData {
  items: ProfileCardItem[];
  currentIndex: number;
}

@Component({
  selector: 'app-dog-detail-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, DatePipe, NgIf, TitleCasePipe, DogImg],
  templateUrl: './dog-detail-modal.component.html',
  styleUrl: './dog-detail-modal.component.scss',
})
export class DogDetailModal {
  private dialogRef = inject(MatDialogRef<DogDetailModal>);
  private data = inject<DogDetailModalData>(MAT_DIALOG_DATA);

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
    if (this.hasPrev) this.currentIndex.update(i => i - 1);
  }

  next(): void {
    if (this.hasNext) this.currentIndex.update(i => i + 1);
  }

  close(): void {
    this.dialogRef.close();
  }
}
