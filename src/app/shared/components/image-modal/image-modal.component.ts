import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { register } from 'swiper/element/bundle';
import { TransformImagePipe } from '../../pipes/transform-image.pipe';

register();

@Component({
  selector: 'app-image-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TransformImagePipe],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss',
})
export class ImageModalComponent {
  @Input() images: string[] = [];
  @Input() startIndex = 0;
  @Input() altText = '';

  constructor(private dialogRef: DialogRef<void, ImageModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
