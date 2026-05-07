import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'breeds/:id',
    loadComponent: () => import('./features/breed/breed').then(m => m.Breed),
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/breed/breed-about/breed-about').then(m => m.BreedAbout),
      },
      {
        path: 'standards',
        loadComponent: () =>
          import('./features/breed/breed-standards/breed-standards').then(m => m.BreedStandards),
      },
      {
        path: 'males',
        loadComponent: () =>
          import('./features/breed/breed-males/breed-males').then(m => m.BreedMales),
      },
      {
        path: 'females',
        loadComponent: () =>
          import('./features/breed/breed-females/breed-females').then(m => m.BreedFemales),
      },
    ],
  },
  {
    path: 'puppies',
    loadComponent: () => import('./features/puppies/puppies').then(m => m.Puppies),
  },
  {
    path: 'puppies/:breed',
    loadComponent: () => import('./features/puppies/puppies').then(m => m.Puppies),
  },
  {
    path: 'archive',
    loadComponent: () => import('./features/archive/archive').then(m => m.Archive),
  },
  {
    path: 'archive/:breed',
    loadComponent: () => import('./features/archive/archive').then(m => m.Archive),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayout),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard.component').then(
            m => m.AdminDashboard
          ),
      },
      {
        path: 'dogs',
        loadComponent: () =>
          import('./features/admin/admin-dogs/admin-dogs.component').then(m => m.AdminDogs),
      },
      {
        path: 'litters',
        loadComponent: () =>
          import('./features/admin/admin-litters/admin-litters.component').then(
            m => m.AdminLitters
          ),
      },
      {
        path: 'puppies',
        loadComponent: () =>
          import('./features/admin/admin-puppies/admin-puppies.component').then(
            m => m.AdminPuppies
          ),
      },
      {
        path: 'breeds',
        loadComponent: () =>
          import('./features/admin/admin-breeds/admin-breeds.component').then(m => m.AdminBreeds),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsers),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
