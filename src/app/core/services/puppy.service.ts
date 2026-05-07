import { inject, Injectable } from '@angular/core';
import { Database, listVal, push, ref, remove, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Puppy } from '../models/puppy.model';

@Injectable({ providedIn: 'root' })
export class PuppyService {
  private db = inject(Database);

  getAllPuppies(): Observable<Puppy[]> {
    return listVal<Puppy>(ref(this.db, 'puppies'), { keyField: 'id' }).pipe(
      map(puppies => puppies ?? [])
    );
  }

  getPuppiesByBreed(breedId: string): Observable<Puppy[]> {
    return this.getAllPuppies().pipe(
      map(puppies => puppies.filter(p => p.breedId === breedId))
    );
  }

  getPuppiesByLitter(litterId: string): Observable<Puppy[]> {
    return this.getAllPuppies().pipe(
      map(puppies => puppies.filter(p => p.litterId === litterId))
    );
  }

  getAvailablePuppies(limit?: number): Observable<Puppy[]> {
    return this.getAllPuppies().pipe(
      map(puppies => {
        const available = puppies.filter(p => p.status === 'available');
        return limit ? available.slice(0, limit) : available;
      })
    );
  }

  addPuppy(puppy: Omit<Puppy, 'id'>): Promise<void> {
    return push(ref(this.db, 'puppies'), puppy).then(() => undefined);
  }

  updatePuppy(id: string, puppy: Partial<Puppy>): Promise<void> {
    return update(ref(this.db, `puppies/${id}`), puppy as Record<string, unknown>);
  }

  deletePuppy(id: string): Promise<void> {
    return remove(ref(this.db, `puppies/${id}`));
  }
}
