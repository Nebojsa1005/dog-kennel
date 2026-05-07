import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { Database, objectVal, ref } from '@angular/fire/database';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Database);

  readonly currentUser$: Observable<User | null> = authState(this.auth);

  readonly isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    switchMap(user => {
      if (!user) return of(false);
      return objectVal(ref(this.db, `admins/${user.uid}`)).pipe(
        map(data => data !== null)
      );
    })
  );

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
