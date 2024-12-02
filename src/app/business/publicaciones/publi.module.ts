import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PubliHeaderComponent } from './components/publi-header/publi-header.component';
import { PubliArticulosComponent } from './components/articulos/publi-articulos/publi-articulos.component';
import { PubliSubirArticuloComponent } from './components/articulos/publi-subir-articulo/publi-subir-articulo.component';
import { PubliEditArticuloComponent } from './components/articulos/publi-edit-articulo/publi-edit-articulo.component';
import { PubliProyectosComponent } from './components/proyectos/publi-proyectos/publi-proyectos.component';
import { PubliSubirProyectoComponent } from './components/proyectos/publi-subir-proyecto/publi-subir-proyecto.component';
import { PubliEditProyectoComponent } from './components/proyectos/publi-edit-proyecto/publi-edit-proyecto.component';


const routes: Routes = [
  {
    path: '',
    component: PubliHeaderComponent,
    children: [
      { path: '', redirectTo: 'mis-articulos', pathMatch: 'full' },
      { path: 'mis-articulos', component: PubliArticulosComponent },
      { path: 'mis-proyectos', component: PubliProyectosComponent },
      // 
      { path: 'subir-articulos', component: PubliSubirArticuloComponent },
      { path: 'editar-articulo/:id', component: PubliEditArticuloComponent },
      { path: 'subir-proyectos', component: PubliSubirProyectoComponent },
      { path: '', redirectTo: 'mis-articulos', pathMatch: 'full' },
      { path: '**', redirectTo: 'mis-articulos' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PubliHeaderComponent,
    PubliArticulosComponent,
    PubliProyectosComponent
  ]
})

export class PubliModule { }

