import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isVisible = signal(false);
  @Output() closeModal = new EventEmitter<void>();

  showPassword = signal(false);
  registerForm: FormGroup;
  profileImgLabel = 'Seleccionar Imagen'; // Texto del label
  profile_img: File | null = null;
  errorMessage: string | null = null; // Propiedad para el mensaje de error

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profile_img = input.files[0];
      this.profileImgLabel = this.profile_img.name; // Actualizar el texto del label
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.get('username')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('first_name', this.registerForm.get('first_name')?.value);
    formData.append('last_name', this.registerForm.get('last_name')?.value);
    if (this.profile_img) {
      formData.append('profile_img', this.profile_img, `${this.registerForm.get('username')?.value}_profile${this.profile_img.name.substring(this.profile_img.name.lastIndexOf('.'))}`);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.closeModal.emit();
        this.router.navigate(['/home']); // Redireccionar a home después de registro exitoso
      },
      error: (err) => {
        console.error('Registration failed', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message; // Capturar el mensaje de error del backend
        } else {
          this.errorMessage = 'Error en el registro. Por favor, inténtelo de nuevo.';
        }
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
