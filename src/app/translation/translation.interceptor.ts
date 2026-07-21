import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { from, of, switchMap } from 'rxjs';
import { TranslationService } from './translation.service';

export const translationInterceptor: HttpInterceptorFn = (req, next) => {
  const translationService = inject(TranslationService);

  if (translationService.currentLang() === 'sr') {
    return next(req);
  }

  return next(req).pipe(
    switchMap((event) => {
      if (!(event instanceof HttpResponse) || event.body == null) {
        return of(event);
      }

      return from(translateValue(event.body, translationService)).pipe(
        switchMap((body) => of(event.clone({ body }))),
      );
    }),
  );
};

async function translateValue(value: unknown, translationService: TranslationService): Promise<unknown> {
  if (typeof value === 'string') {
    return translationService.translate(value);
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => translateValue(item, translationService)));
  }

  if (value !== null && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, val]) => [key, await translateValue(val, translationService)] as const),
    );
    return Object.fromEntries(entries);
  }

  return value;
}
