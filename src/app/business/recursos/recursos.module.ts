import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RecursosHeaderComponent } from './components/recursos-header/recursos-header.component';
import { RecursosListComponent } from './components/recursos-list/recursos-list.component';
// import { MisPreguntasComponent } from './components/mis-preguntas/mis-preguntas.component';
// import { PreguntaSubirComponent } from './components/pregunta-subir/pregunta-subir.component';
// import { PreguntaDetailComponent } from './components/pregunta-detail/pregunta-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RecursosHeaderComponent,
    children: [
      { path: '', redirectTo: 'lista/guias', pathMatch: 'full' },
      { path: 'lista/:category', component: RecursosListComponent }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RecursosHeaderComponent,
    RecursosListComponent
  ]
})

export class RecursosModule { }
