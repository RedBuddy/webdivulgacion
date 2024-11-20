import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConfigSidebarComponent } from './components/config-sidebar/config-sidebar.component';
import { ConfigCuentaComponent } from './components/config-cuenta/config-cuenta.component';
import { ConfigPerfilComponent } from './components/config-perfil/config-perfil.component';
import { ConfigTemaComponent } from './components/config-tema/config-tema.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigSidebarComponent,
    children: [
      { path: 'cuenta', component: ConfigCuentaComponent },
      { path: 'perfil', component: ConfigPerfilComponent },
      { path: 'tema', component: ConfigTemaComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConfigSidebarComponent,
    ConfigCuentaComponent,
    ConfigPerfilComponent,
    ConfigTemaComponent
  ]
})

export class ConfigModule { }

