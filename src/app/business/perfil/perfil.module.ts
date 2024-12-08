import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilHeaderComponent } from './components/perfil-header/perfil-header.component';
import { PerfilInfoComponent } from './components/perfil-info/perfil-info.component';
import { PerfilArticulosComponent } from './components/perfil-articulos/perfil-articulos.component';
import { PerfilProyectosComponent } from './components/perfil-proyectos/perfil-proyectos.component';

const routes: Routes = [
  {
    path: ':id',
    component: PerfilHeaderComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: PerfilInfoComponent },
      { path: 'articulos', component: PerfilArticulosComponent },
      { path: 'proyectos', component: PerfilProyectosComponent },

      { path: '**', redirectTo: 'info' }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilHeaderComponent,
    PerfilInfoComponent,
    PerfilArticulosComponent,
    PerfilProyectosComponent
  ]
})
export class PerfilModule { }

