import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from '../../../business/authentication/login/login.component';
import { RegisterComponent } from '../../../business/authentication/register/register.component';
import { Subscription } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('loginModal') loginModal: LoginComponent | undefined;
  @ViewChild('registerModal') registerModal: RegisterComponent | undefined;
  isSearchVisible = false;
  isAuthenticated = false;
  userRole: string | null = null;
  userImage: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      })
    );

    this.subscriptions.add(
      this.authService.userRole$.subscribe(userRole => {
        this.userRole = userRole;
      })
    );

    this.subscriptions.add(
      this.authService.userImage$.subscribe(userImage => {
        this.userImage = userImage;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  openRegisterModal() {
    if (this.registerModal) {
      this.registerModal.isVisible.set(true);
    }
  }

  closeRegisterModal() {
    if (this.registerModal) {
      this.registerModal.isVisible.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }
}
