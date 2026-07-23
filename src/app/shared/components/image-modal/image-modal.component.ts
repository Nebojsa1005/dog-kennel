import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss',
})
export class ImageModalComponent {
  @Input() imageUrl!: string;
  @Input() altText = '';

  constructor(private dialogRef: DialogRef<void, ImageModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
