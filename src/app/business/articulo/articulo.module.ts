import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VistaArticuloComponent } from './components/vista-articulo/vista-articulo.component';

const routes: Routes = [
  { path: ':id', component: VistaArticuloComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    VistaArticuloComponent
  ]
})

export class ArticuloModule { }
