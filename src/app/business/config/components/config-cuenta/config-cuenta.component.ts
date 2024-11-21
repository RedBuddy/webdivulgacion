import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-cuenta.component.html',
  styleUrl: './config-cuenta.component.scss'
})
export class ConfigCuentaComponent implements OnInit {
  accountForm: FormGroup;
  profileImgLabel = 'Seleccionar Imagen'; // Texto del label
  profile_img: File | null = null;

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      profile_img: [null]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profile_img = input.files[0];
      this.profileImgLabel = this.profile_img.name; // Actualizar el texto del label
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

    const formData = new FormData();
    formData.append('first_name', this.accountForm.get('first_name')?.value);
    formData.append('last_name', this.accountForm.get('last_name')?.value);
    formData.append('current_password', this.accountForm.get('current_password')?.value);
    formData.append('new_password', this.accountForm.get('new_password')?.value);
    if (this.profile_img) {
      formData.append('profile_img', this.profile_img, this.profile_img.name);
    }

    // Aquí puedes llamar a tu servicio para actualizar los datos de la cuenta
    // this.authService.updateAccount(formData).subscribe(...);
  }
}
