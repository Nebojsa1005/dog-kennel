import { inject, Injectable } from '@angular/core';
import { Database, listVal, push, ref, remove, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Litter } from '../models/litter.model';

@Injectable({ providedIn: 'root' })
export class LitterService {
  private db = inject(Database);

  getAllLitters(): Observable<Litter[]> {
    return listVal<Litter>(ref(this.db, 'litters'), { keyField: 'id' }).pipe(
      map(litters => litters ?? [])
    );
  }

  getLittersByBreed(breedId: string): Observable<Litter[]> {
    return this.getAllLitters().pipe(
      map(litters => litters.filter(l => l.breedId === breedId))
    );
  }

  addLitter(litter: Omit<Litter, 'id'>): Promise<void> {
    return push(ref(this.db, 'litters'), litter).then(() => undefined);
  }

  updateLitter(id: string, litter: Partial<Litter>): Promise<void> {
    return update(ref(this.db, `litters/${id}`), litter as Record<string, unknown>);
  }

  deleteLitter(id: string): Promise<void> {
    return remove(ref(this.db, `litters/${id}`));
  }
}
