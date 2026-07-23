import { inject, Injectable } from '@angular/core';
import { Database, listVal, objectVal, ref, set } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { AboutImage, AboutStats } from '../models/about.model';

const DEFAULT_STATS: AboutStats = { years: '', litters: '', puppies: '', countries: '' };

@Injectable({ providedIn: 'root' })
export class AboutService {
  private db = inject(Database);

  getText(): Observable<string> {
    return objectVal<string>(ref(this.db, 'about/text')).pipe(map(text => text ?? ''));
  }

  setText(text: string): Promise<void> {
    return set(ref(this.db, 'about/text'), text);
  }

  getImages(): Observable<AboutImage[]> {
    return listVal<AboutImage>(ref(this.db, 'about/images')).pipe(map(images => images ?? []));
  }

  setImages(images: AboutImage[]): Promise<void> {
    return set(ref(this.db, 'about/images'), images);
  }

  getStats(): Observable<AboutStats> {
    return objectVal<AboutStats>(ref(this.db, 'about/stats')).pipe(
      map(stats => stats ?? DEFAULT_STATS)
    );
  }

  setStats(stats: AboutStats): Promise<void> {
    return set(ref(this.db, 'about/stats'), stats);
  }
}
