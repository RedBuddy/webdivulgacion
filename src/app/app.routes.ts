import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./business/landing-page/landing.module').then(m => m.LandingModule)
        //canActivate: [authGuard]
      },
      {
        path: 'preguntas',
        loadChildren: () => import('./business/preguntas/preguntas.module').then(m => m.PreguntasModule),
        canActivate: [authGuard]
      },
      {
        path: 'recursos',
        loadChildren: () => import('./business/recursos/recursos.module').then(m => m.RecursosModule),
        //canActivate: [authGuard]
      },
      {
        path: 'investigadores',
        loadComponent: () => import('./business/investigadores/components/investigadores-list/investigadores-list.component'),
        // canActivate: [authGuard]
      },
      {
        path: 'contacto',
        loadChildren: () => import('./business/contacto/contacto.module').then(m => m.ContactoModule),
        canActivate: [authGuard]
      },
      {
        path: 'config',
        loadChildren: () => import('./business/config/config.module').then(m => m.ConfigModule),
        canActivate: [authGuard]
      },
      {
        path: 'mis-publicaciones',
        loadChildren: () => import('./business/publicaciones/publi.module').then(m => m.PubliModule),
        canActivate: [authGuard]
      },
      {
        path: 'articulo',
        loadChildren: () => import('./business/articulo/articulo.module').then(m => m.ArticuloModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./business/perfil/perfil.module').then(m => m.PerfilModule)
      },
      {
        path: 'verificar-email',
        loadComponent: () => import('./business/authentication/verificar-email/verificar-email.component')
      },
      {
        path: 'admin',
        loadChildren: () => import('./business/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authGuard]
      },
      {
        path: 'not-found',
        loadComponent: () => import('./shared/components/notfound/notfound.component')
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
