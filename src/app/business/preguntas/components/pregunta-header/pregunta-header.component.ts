import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pregunta-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './pregunta-header.component.html',
  styleUrl: './pregunta-header.component.scss'
})

export class PreguntaHeaderComponent {
  showHeader: boolean = true;
  private routerSubscription!: Subscription;

  searchControl: FormControl = new FormControl('');

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Verificar la ruta actual al inicializar el componente
    this.checkCurrentRoute(this.router.url);

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkCurrentRoute(event.url);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  navigateToPublish(): void {
    this.router.navigate(['preguntas/subir']);
  }

  searchArticles(): void {
    const searchValue = this.searchControl.value;
    const currentRoute = this.router.url.split('?')[0];
    if (currentRoute.includes('mis-articulos')) {
      this.router.navigate(['mis-publicaciones/mis-articulos'], { queryParams: { search: searchValue }, queryParamsHandling: 'merge' });
    } else if (currentRoute.includes('mis-proyectos')) {
      this.router.navigate(['mis-publicaciones/mis-proyectos'], { queryParams: { search: searchValue }, queryParamsHandling: 'merge' });
    }
  }

  private checkCurrentRoute(url: string): void {
    this.showHeader = !url.includes('subir');
  }
}
