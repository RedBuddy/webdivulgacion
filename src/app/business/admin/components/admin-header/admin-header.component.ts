import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
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
    this.router.navigate(['admin/recurso-subir']);
  }


  private checkCurrentRoute(url: string): void {
    this.showHeader = !(url.includes('recurso-subir') || url.includes('recurso-editar'));
  }
}
