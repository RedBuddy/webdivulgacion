import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service'; // Asegúrate de que la ruta sea correcta
import { IUser } from '../../../../core/models/user.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-config-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-cuenta.component.html',
  styleUrls: ['./config-cuenta.component.scss']
})
export class ConfigCuentaComponent implements OnInit {
  accountForm: FormGroup;
  profileImgLabel = 'Seleccionar Imagen'; // Texto del label
  profile_img: File | null = null;
  errorMessage: string | null = null; // Propiedad para el mensaje de error
  successMessage: string | null = null; // Propiedad para el mensaje de éxito

  constructor(private fb: FormBuilder, private configService: ConfigService) {
    this.accountForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      current_password: ['', Validators.required],
      new_password: ['', [Validators.minLength(8)]],
      confirm_password: [''],
      profile_img: [null]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.configService.getUser().subscribe({
      next: (user: IUser) => {
        this.accountForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        });
      },
      error: (err) => {
        // console.error('Error loading user data', err);
        this.errorMessage = 'Error al cargar los datos del usuario.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profile_img = input.files[0];
      if (!this.profile_img.type.startsWith('image/')) {
        this.errorMessage = 'El archivo debe ser una imagen.';
        return;
      }
      this.profileImgLabel = this.profile_img.name; // Actualizar el texto del label
      this.errorMessage = null;
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('confirm_password');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  updateAccount(): void {
    if (this.accountForm.invalid) {
      return;
    }

    const user: IUser = {
      first_name: this.accountForm.get('first_name')?.value,
      last_name: this.accountForm.get('last_name')?.value,
      email: this.accountForm.get('email')?.value,
      password: this.accountForm.get('current_password')?.value,
    };

    const currentPassword = this.accountForm.get('current_password')?.value;
    const newPassword = this.accountForm.get('new_password')?.value;

    this.configService.updateAccount(user, currentPassword, newPassword, this.profile_img || undefined).subscribe({
      next: (response) => {
        // console.log('Account updated successfully', response);
        this.successMessage = response.message || 'Cuenta actualizada con éxito'; // Mostrar mensaje de éxito del backend o mensaje por defecto
        this.errorMessage = null; // Limpiar mensaje de error
      },
      error: (err) => {
        console.error('Error updating account', err);
        this.errorMessage = err; // Capturar el mensaje de error del backend
      }
    });
  }
}
