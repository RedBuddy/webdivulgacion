import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'preguntas',
        loadComponent: () => import('./business/preguntas/components/pregunta-header/pregunta-header.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'recursos',
        loadComponent: () => import('./business/recursos/components/recursos-header/recursos-header.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'investigadores',
        loadComponent: () => import('./business/investigadores/components/investigadores-list/investigadores-list.component'),
        canActivate: [authGuard]
      },
      {
        path: 'contacto',
        loadComponent: () => import('./business/contacto/components/contacto-list/contacto-list.component'),
        // canActivate: [authGuard]
      },
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
    redirectTo: 'home'
  }
];
