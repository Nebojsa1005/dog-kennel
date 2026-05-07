import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, map, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Admin } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

interface AdminRow extends Admin {
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  displayedColumns = ['email', 'name', 'addedAt', 'actions'];
  admins$!: Observable<AdminRow[]>;

  addForm = new FormGroup({
    uid: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  saving = false;
  errorMsg = '';

  ngOnInit(): void {
    this.admins$ = combineLatest([
      this.adminService.getAdmins(),
      this.authService.currentUser$,
    ]).pipe(
      map(([admins, user]) =>
        admins.map(a => ({ ...a, isCurrentUser: a.id === user?.uid }))
      )
    );
  }

  addAdmin(): void {
    if (this.addForm.invalid) return;
    this.saving = true;
    this.errorMsg = '';
    const { uid, email, name } = this.addForm.getRawValue();
    this.adminService
      .addAdmin(uid, email, name)
      .then(() => {
        this.addForm.reset();
        this.saving = false;
      })
      .catch(err => {
        this.errorMsg = err?.message ?? 'Failed to add admin';
        this.saving = false;
      });
  }

  removeAdmin(admin: AdminRow): void {
    if (admin.isCurrentUser || !admin.id) return;
    if (!confirm(`Remove admin ${admin.email}?`)) return;
    this.adminService.removeAdmin(admin.id);
  }
}
