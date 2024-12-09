import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PreguntaHeaderComponent } from './components/pregunta-header/pregunta-header.component';
import { PreguntasListComponent } from './components/preguntas-list/preguntas-list.component';
import { MisPreguntasComponent } from './components/mis-preguntas/mis-preguntas.component';
import { PreguntaSubirComponent } from './components/pregunta-subir/pregunta-subir.component';

const routes: Routes = [
  {
    path: '',
    component: PreguntaHeaderComponent,
    children: [
      { path: '', redirectTo: 'lista', pathMatch: 'full' },
      { path: 'lista', component: PreguntasListComponent },
      { path: 'mis-preguntas', component: MisPreguntasComponent },
      { path: 'subir', component: PreguntaSubirComponent }
    ]
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PreguntaHeaderComponent,
    PreguntasListComponent,
    MisPreguntasComponent,
    PreguntaSubirComponent
  ]
})

export class PreguntasModule { }
