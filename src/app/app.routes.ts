import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./business/dashboard/dashboard.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./business/profile/profile.component'),
        //canActivate: [authGuard]
      },
      // {
      //   path: 'tables',
      //   loadComponent: () => import('./business/tables/tables.component'),
      //   canActivate: [authGuard]
      // },
      // {
      //   path: 'forms',
      //   loadComponent: () => import('./business/forms/forms.component'),
      //   // canActivate: [authGuard]
      // },
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // }
    ]
  },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./business/authentication/login/login.component'),
  //   canActivate: [authenticatedGuard]
  // },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
