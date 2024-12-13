import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export default class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetToken: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.resetToken) {
      const password = this.resetForm.get('password')?.value;
      this.authService.resetPassword(this.resetToken, password).subscribe({
        next: () => {
          this.successMessage = 'Contraseña restablecida exitosamente.';
          this.errorMessage = null;
          setTimeout(() => {
            // this.router.navigate(['inicii']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.successMessage = null;
        }
      });
    }
  }
}
