import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

export const DD_MM_YYYY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** Native DateAdapter overridden to always render/parse dates as DD/MM/YYYY. */
@Injectable()
export class DdMmYyyyDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value !== 'string' || !value.trim()) return null;

    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;

    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return this.isDateValid(date) ? date : null;
  }

  override format(date: Date, displayFormat: string): string {
    if (!this.isDateValid(date)) return '';

    switch (displayFormat) {
      case 'MMM YYYY':
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
      case 'MMMM YYYY':
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
      default: {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${date.getFullYear()}`;
      }
    }
  }

  private isDateValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
