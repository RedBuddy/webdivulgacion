import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  isSearchVisible: boolean = false; // Estado inicial de la barra de búsqueda

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible; // Cambia el estado de visibilidad
  }
}
