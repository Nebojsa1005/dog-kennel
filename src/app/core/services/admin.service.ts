import { inject, Injectable } from '@angular/core';
import { Database, listVal, ref, remove, set } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Admin } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private db = inject(Database);

  getAdmins(): Observable<Admin[]> {
    return listVal<Admin>(ref(this.db, 'admins'), { keyField: 'id' }).pipe(
      map(admins => admins ?? [])
    );
  }

  addAdmin(uid: string, email: string, name: string): Promise<void> {
    return set(ref(this.db, `admins/${uid}`), {
      email,
      name,
      addedAt: Date.now(),
    });
  }

  removeAdmin(uid: string): Promise<void> {
    return remove(ref(this.db, `admins/${uid}`));
  }
}
