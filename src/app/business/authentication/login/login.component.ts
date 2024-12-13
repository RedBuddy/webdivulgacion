import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isVisible = signal(false);
  @Output() closeModal = new EventEmitter<void>();

  showPassword = signal(false);
  identifier = '';
  password = '';
  errorMessage = ''; // Propiedad para el mensaje de error

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
      },
      error: (err) => {
        this.errorMessage = err.message; // Establecer el mensaje de error

        if (err.status === 403) {
          setTimeout(() => {
            this.errorMessage = 'Serás redirigido a verificación de email en 3 segundos';
          }, 1000);
          setTimeout(() => {
            this.closeModal.emit();
            this.router.navigate(['verificar-email']);
          }, 3000);
        }
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
