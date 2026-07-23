import { Injectable, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ImageModalComponent } from '../../shared/components/image-modal/image-modal.component';

@Injectable({ providedIn: 'root' })
export class ImageModalService {
  private dialog = inject(Dialog);

  open(imageUrl: string, altText = ''): DialogRef<void, ImageModalComponent> {
    const dialogRef = this.dialog.open<void, unknown, ImageModalComponent>(ImageModalComponent, {
      hasBackdrop: true,
      role: 'dialog',
      ariaModal: true,
      ariaLabel: 'Image preview',
    });

    dialogRef.componentInstance!.imageUrl = imageUrl;
    dialogRef.componentInstance!.altText = altText;

    return dialogRef;
  }
}
