import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() label = '';
  @Input() labelKey = '';
  @Input() variant: 'available' | 'reserved' | 'sold' | 'default' = 'default';
}
