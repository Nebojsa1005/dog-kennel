import { inject, Injectable } from '@angular/core';
import { Database, listVal, push, ref, remove } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { GuestbookEntry } from '../models/guestbook-entry.model';

@Injectable({ providedIn: 'root' })
export class GuestbookService {
  private db = inject(Database);

  getAllEntries(): Observable<GuestbookEntry[]> {
    return listVal<GuestbookEntry>(ref(this.db, 'guestbook'), { keyField: 'id' }).pipe(
      map(entries => (entries ?? []).sort((a, b) => b.createdAt - a.createdAt))
    );
  }

  addEntry(entry: Omit<GuestbookEntry, 'id'>): Promise<void> {
    return push(ref(this.db, 'guestbook'), entry).then((r) => console.log(r)).catch((e) => console.error(e));
  }

  deleteEntry(id: string): Promise<void> {
    return remove(ref(this.db, `guestbook/${id}`));
  }
}
