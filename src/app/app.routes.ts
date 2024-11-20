import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./business/landing-page/components/article-list/article-list.component'),
        //canActivate: [authGuard]
      },
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
      {
        path: 'config',
        loadChildren: () => import('./business/config/config.module').then(m => m.ConfigModule)
      },
      // {
      //   path: 'config',
      //   loadComponent: () => import('./business/config/components/config-sidebar/config-sidebar.component'),
      //   children: [
      //     {
      //       path: 'cuenta',
      //       loadComponent: () => import('./business/config/components/config-cuenta/config-cuenta.component')
      //     },
      //     {
      //       path: 'perfil',
      //       loadComponent: () => import('./business/config/components/config-perfil/config-perfil.component')
      //     },
      //     {
      //       path: 'tema',
      //       loadComponent: () => import('./business/config/components/config-tema/config-tema.component')
      //     }
      //   ]
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
    redirectTo: 'home'
  }
];
