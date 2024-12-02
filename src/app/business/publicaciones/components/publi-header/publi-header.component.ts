import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-publi-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './publi-header.component.html',
  styleUrl: './publi-header.component.scss'
})
export class PubliHeaderComponent implements OnInit, OnDestroy {

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
    const currentUrl = this.router.url;
    if (currentUrl.includes('mis-articulos')) {
      this.router.navigate(['mis-publicaciones/subir-articulos']);
    } else if (currentUrl.includes('mis-proyectos')) {
      this.router.navigate(['mis-publicaciones/subir-proyectos']);
    }
  }

  searchArticles(): void {
    const searchValue = this.searchControl.value;
    this.router.navigate(['mis-publicaciones/mis-articulos'], { queryParams: { search: searchValue } });
  }

  private checkCurrentRoute(url: string): void {
    this.showHeader = !url.includes('subir-articulos') && !url.includes('subir-proyectos') && !url.includes('editar-articulo') && !url.includes('editar-proyecto');
  }
}
