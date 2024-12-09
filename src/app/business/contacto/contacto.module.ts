import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactoListComponent } from './components/contacto-list/contacto-list.component';
import { ContactoMensajeComponent } from './components/contacto-mensaje/contacto-mensaje.component';

const routes: Routes = [
  { path: '', component: ContactoListComponent },
  { path: 'mensaje', component: ContactoMensajeComponent },
  { path: 'mensaje/:email', component: ContactoMensajeComponent } // Ruta con parámetro
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContactoListComponent,
    ContactoMensajeComponent
  ]
})

export class ContactoModule { }
