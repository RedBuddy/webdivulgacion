import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
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

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      orcid: ['', Validators.pattern('[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]')],
      university: [''],
      faculty: [''],
      department: [''],
      biography: [''],
      experience: [''],
      google_scholar_link: [''],
      research_gate_link: ['']
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
      this.profileImgLabel = this.profile_img.name;
    }
  }

  passwordMatchValidator(formGroup: FormGroup): null | { mismatch: true } {
    return formGroup.get('password')?.value === formGroup.get('confirm_password')?.value ? null : { mismatch: true };
  }

  nextStep(): void {
    const nextTab = document.querySelector('#pills-perfil-tab') as HTMLElement;
    nextTab.click();
  }

  previousStep(): void {
    const previousTab = document.querySelector('#pills-datos-tab') as HTMLElement;
    previousTab.click();
  }

  register(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.registerForm.get('username')?.value);
      formData.append('first_name', this.registerForm.get('first_name')?.value);
      formData.append('last_name', this.registerForm.get('last_name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('confirm_password', this.registerForm.get('confirm_password')?.value);
      formData.append('terms', this.registerForm.get('terms')?.value);

      if (this.profile_img) {
        formData.append('profile_img', this.profile_img);
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.createProfile();
        },
        error: (error) => {
          console.error('Error en el registro', error);
          this.errorMessage = 'Error en el registro. Por favor, inténtelo de nuevo.';
        }
      });
    }
  }

  createProfile(): void {
    const profileData = {
      id_user: 0, // Este valor se actualizará en el servicio
      university: this.registerForm.get('university')?.value,
      faculty: this.registerForm.get('faculty')?.value,
      department: this.registerForm.get('department')?.value,
      orcid: this.registerForm.get('orcid')?.value,
      biography: this.registerForm.get('biography')?.value,
      experience: this.registerForm.get('experience')?.value,
      google_scholar_link: this.registerForm.get('google_scholar_link')?.value,
      research_gate_link: this.registerForm.get('research_gate_link')?.value
    };

    this.profileService.createProfile(profileData).subscribe({
      next: (response) => {
        console.log('Perfil creado exitosamente', response);
        this.close();
      },
      error: (error) => {
        console.error('Error al crear el perfil', error);
        this.errorMessage = 'Error al crear el perfil. Por favor, inténtelo de nuevo.';
      }
    });
  }

  close(): void {
    this.isVisible.set(false);
    this.closeModal.emit();
  }
}