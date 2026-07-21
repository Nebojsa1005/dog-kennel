import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-translation-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!dismissed() && (status() === 'limit_reached' || status() === 'error')) {
      <div class="translation-banner" [class.translation-banner--error]="status() === 'error'">
        <span>
          @if (status() === 'limit_reached') {
            Translation limit reached. Some text may appear in Serbian.
          } @else {
            Translation is temporarily unavailable. Some text may appear in Serbian.
          }
        </span>
        <button type="button" class="translation-banner__dismiss" (click)="dismiss()" aria-label="Dismiss">
          &times;
        </button>
      </div>
    }
  `,
  styles: `
    .translation-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: #fff3cd;
      color: #664d03;
      font-size: 0.9rem;
      box-sizing: border-box;
    }

    .translation-banner--error {
      background: #f8d7da;
      color: #842029;
    }

    .translation-banner__dismiss {
      background: none;
      border: none;
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
      color: inherit;
    }
  `,
})
export class TranslationBannerComponent {
  private readonly translationService = inject(TranslationService);

  readonly status = this.translationService.translationStatus;
  readonly dismissed = signal(false);

  dismiss(): void {
    this.dismissed.set(true);
  }
}
