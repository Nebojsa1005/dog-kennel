import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <div class="login-page">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Admin Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="login-hint">Sign in with your Google account to access the admin panel.</p>
          <button mat-raised-button color="primary" (click)="signIn()">
            Sign in with Google
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f5f5f5;
      }
      .login-card {
        padding: 2rem;
        text-align: center;
        min-width: 320px;
      }
      .login-hint {
        color: #666;
        margin-bottom: 1.5rem;
        margin-top: 1rem;
      }
      button {
        width: 100%;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (isAdmin) this.router.navigate(['/admin/dashboard']);
    });
  }

  async signIn(): Promise<void> {
    await this.authService.signInWithGoogle();
    this.authService.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }
}
