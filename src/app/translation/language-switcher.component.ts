import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomTranslatorService } from './dom-translator.service';
import { TranslationService } from './translation.service';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from './translation.model';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      class="language-switcher"
      [value]="translationService.currentLang()"
      (change)="onChange($event)"
    >
      @for (lang of languages; track lang.code) {
        <option [value]="lang.code">{{ lang.label }}</option>
      }
    </select>
  `,
})
export class LanguageSwitcherComponent implements OnInit {
  protected readonly translationService = inject(TranslationService);
  private readonly domTranslator = inject(DomTranslatorService);

  readonly languages = (Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((code) => ({
    code,
    label: SUPPORTED_LANGUAGES[code],
  }));

  ngOnInit(): void {
    this.domTranslator.start();
  }

  onChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value as SupportedLanguage;
    this.translationService.setLanguage(lang);
    this.domTranslator.retranslate();
  }
}
