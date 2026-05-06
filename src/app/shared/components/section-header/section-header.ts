import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
})
export class SectionHeader {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() eyebrowKey = '';
  @Input() titleKey = '';
  @Input() center = false;
}
