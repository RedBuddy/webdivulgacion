import { Component } from '@angular/core';
import { AlbumComponent } from '../pages/album/album.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

import { MenuRegistroComponent } from '../menus/menu-registro/menu-registro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlbumComponent, NavbarComponent, MenuRegistroComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
