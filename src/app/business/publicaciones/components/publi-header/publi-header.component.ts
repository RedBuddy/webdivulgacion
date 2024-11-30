import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-publi-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './publi-header.component.html',
  styleUrl: './publi-header.component.scss'
})
export class PubliHeaderComponent {

}
