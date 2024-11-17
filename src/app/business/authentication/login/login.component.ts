import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isVisible = signal(false);
  @Output() closeModal = new EventEmitter<void>();

  showPassword = signal(false);
  identifier = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  login(): void {
    this.authService.login(this.identifier, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        this.closeModal.emit();
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Login failed', err);
        // Handle login error
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
