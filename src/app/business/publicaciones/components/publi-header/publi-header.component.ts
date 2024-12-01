import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-publi-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './publi-header.component.html',
  styleUrl: './publi-header.component.scss'
})
export class PubliHeaderComponent implements OnInit, OnDestroy {

  showHeader: boolean = true;
  private routerSubscription!: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeader = !event.url.includes('subir-articulos') && !event.url.includes('subir-proyectos');
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

}
