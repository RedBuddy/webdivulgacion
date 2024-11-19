import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

// Import the interfaz user
import { IUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isVisible = signal(false);
  @Output() closeModal = new EventEmitter<void>();

  showPassword = signal(false);
  username = '';
  email = '';
  password = '';
  confirm_password = '';
  first_name = '';
  last_name = '';
  profile_img: File | null = null;
  termsAccepted = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profile_img = input.files[0];
    }
  }

  register(): void {
    if (this.password !== this.confirm_password) {
      console.error('Passwords do not match');
      return;
    }

    const user: IUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      first_name: this.first_name,
      last_name: this.last_name,
      profile_img: this.profile_img ? new Blob([this.profile_img], { type: this.profile_img.type }) : undefined
    };

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    if (this.profile_img) {
      formData.append('profile_img', this.profile_img, `${this.username}_profile${this.profile_img.name.substring(this.profile_img.name.lastIndexOf('.'))}`);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.closeModal.emit();
        this.router.navigate(['/home']); // Redireccionar a home después de registro exitoso
      },
      error: (err) => {
        console.error('Registration failed', err);
        // Handle registration error
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
