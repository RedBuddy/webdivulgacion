import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { FiltroComponent } from './components/filtro/filtro.component';

const routes: Routes = [
  { path: '', component: ArticleListComponent },
  { path: 'filtrar/:texto', component: FiltroComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ArticleListComponent,
    FiltroComponent
  ]
})

export class LandingModule { }
