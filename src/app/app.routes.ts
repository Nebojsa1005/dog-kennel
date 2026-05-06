import { Routes } from '@angular/router';

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
        loadComponent: () => import('./features/breed/breed-about/breed-about').then(m => m.BreedAbout),
      },
      {
        path: 'standards',
        loadComponent: () => import('./features/breed/breed-standards/breed-standards').then(m => m.BreedStandards),
      },
      {
        path: 'males',
        loadComponent: () => import('./features/breed/breed-males/breed-males').then(m => m.BreedMales),
      },
      {
        path: 'females',
        loadComponent: () => import('./features/breed/breed-females/breed-females').then(m => m.BreedFemales),
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
  { path: '**', redirectTo: '' },
];
