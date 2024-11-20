import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-config-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './config-sidebar.component.html',
  styleUrl: './config-sidebar.component.scss'
})
export class ConfigSidebarComponent {

}
