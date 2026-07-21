import { Injectable, signal } from '@angular/core';
import {
  LIBRETRANSLATE_LANG_MAP,
  SupportedLanguage,
  TranslationStatus,
} from './translation.model';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly currentLang = signal<SupportedLanguage>('sr');
  readonly translationStatus = signal<TranslationStatus>('ok');

  private readonly apiUrl = '/.netlify/functions/translate';
  private readonly cache = new Map<string, string>();

  constructor() {
    this.keepAlive();
  }

  async translate(text: string): Promise<string> {
    const lang = this.currentLang();
    if (lang === 'sr') {
      return text;
    }

    const cacheKey = `${lang}:${text}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    this.translationStatus.set('loading');

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'sr',
          target: LIBRETRANSLATE_LANG_MAP[lang],
          format: 'text',
        }),
      });

      if (response.status === 429) {
        this.translationStatus.set('limit_reached');
        return text;
      }

      if (!response.ok) {
        this.translationStatus.set('error');
        return text;
      }

      const data = await response.json();

      if (data?.error) {
        const isQuota = typeof data.error === 'string' && /quota|limit/i.test(data.error);
        this.translationStatus.set(isQuota ? 'limit_reached' : 'error');
        return text;
      }

      this.translationStatus.set('ok');
      this.cache.set(cacheKey, data.translatedText);
      return data.translatedText;
    } catch {
      this.translationStatus.set('error');
      return text;
    }
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.cache.clear();
  }

  private keepAlive(): void {
    setInterval(
      () => {
        if (this.currentLang() === 'sr') {
          return;
        }
        fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: 'pas', source: 'sr', target: 'en', format: 'text' }),
        }).catch(() => {});
      },
      10 * 60 * 1000,
    );
  }
}
