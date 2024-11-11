import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-registro.component.html',
  styleUrl: './menu-registro.component.scss'
})
export class MenuRegistroComponent {
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      const passwordField = document.getElementById('password') as HTMLInputElement;
      passwordField.type = this.showPassword ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
      const confirmPasswordField = document.getElementById('confirmPassword') as HTMLInputElement;
      confirmPasswordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
  }
}