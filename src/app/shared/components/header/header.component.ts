import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from '../../../business/authentication/login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('loginModal') loginModal: LoginComponent | undefined;
  isSearchVisible = false;
  isAuthenticated = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole();
  }

  toggleSearch(event: Event) {
    event.stopPropagation();
    this.isSearchVisible = !this.isSearchVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
      this.isSearchVisible = false;
    }
  }

  openLoginModal() {
    if (this.loginModal) {
      this.loginModal.isVisible.set(true);
    }
  }

  closeLoginModal() {
    if (this.loginModal) {
      this.loginModal.isVisible.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }
}
