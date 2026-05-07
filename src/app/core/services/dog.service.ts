import { inject, Injectable } from '@angular/core';
import { Database, listVal, push, ref, remove, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Dog } from '../models/dog.model';

@Injectable({ providedIn: 'root' })
export class DogService {
  private db = inject(Database);

  getAllDogs(): Observable<Dog[]> {
    return listVal<Dog>(ref(this.db, 'dogs'), { keyField: 'id' }).pipe(
      map(dogs => dogs ?? [])
    );
  }

  getDogsByBreed(breedId: string, gender: 'male' | 'female'): Observable<Dog[]> {
    return this.getAllDogs().pipe(
      map(dogs => dogs.filter(d => d.breedId === breedId && d.gender === gender))
    );
  }

  addDog(dog: Omit<Dog, 'id'>): Promise<void> {
    return push(ref(this.db, 'dogs'), dog).then(() => undefined);
  }

  updateDog(id: string, dog: Partial<Dog>): Promise<void> {
    return update(ref(this.db, `dogs/${id}`), dog as Record<string, unknown>);
  }

  deleteDog(id: string): Promise<void> {
    return remove(ref(this.db, `dogs/${id}`));
  }
}
