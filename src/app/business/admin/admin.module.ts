import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
// Recursos
import { RecursosListComponent } from './components/recursos/recursos-list/recursos-list.component';
import { RecursosSubirComponent } from './components/recursos/recursos-subir/recursos-subir.component';
import { RecursosEditarComponent } from './components/recursos/recursos-editar/recursos-editar.component';
// Usuarios
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
// Categorias
import { CategoriasListComponent } from './components/categorias/categorias-list/categorias-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHeaderComponent,
    children: [
      { path: '', redirectTo: 'recursos', pathMatch: 'full' },
      // Recursos
      { path: 'recursos', component: RecursosListComponent },
      { path: 'recurso-subir', component: RecursosSubirComponent },
      { path: 'recurso-editar', component: RecursosEditarComponent },
      // Usuarios
      { path: 'usuarios', component: UsuariosListComponent },
      // Categorias
      { path: 'categorias', component: CategoriasListComponent },
      // // subrutas de proyectos
      // { path: 'subir-proyectos', component: PubliSubirProyectoComponent },
      // { path: 'editar-proyecto/:id', component: PubliEditProyectoComponent },

      { path: '**', redirectTo: 'recursos' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminHeaderComponent
  ]
})

export class AdminModule { }
