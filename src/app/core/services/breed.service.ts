import { inject, Injectable } from '@angular/core';
import { Database, listVal, objectVal, ref, set, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { BreedData } from '../models/breed.model';

@Injectable({ providedIn: 'root' })
export class BreedService {
  private db = inject(Database);

  getBreeds(): Observable<BreedData[]> {
    return listVal<BreedData>(ref(this.db, 'breeds'), { keyField: 'id' }).pipe(
      map(breeds => breeds ?? [])
    );
  }

  getBreed(id: string): Observable<BreedData | null> {
    return objectVal<BreedData>(ref(this.db, `breeds/${id}`));
  }

  updateBreed(id: string, data: Partial<BreedData>): Promise<void> {
    return update(ref(this.db, `breeds/${id}`), data as Record<string, unknown>);
  }

  setBreed(id: string, data: BreedData): Promise<void> {
    return set(ref(this.db, `breeds/${id}`), data);
  }
}
