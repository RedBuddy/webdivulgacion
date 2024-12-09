import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-verificar-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verificar-email.component.html',
  styleUrl: './verificar-email.component.scss'
})

export default class VerificarEmailComponent implements OnInit {
  verifyForm: FormGroup;
  resendForm: FormGroup;
  token: string | null = null;
  verificationMessage: string | null = null;
  errorMessage: string | null = null;
  resendMessage: string | null = null;
  showVerifyForm: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.verifyForm = this.fb.group({
      token: ['', Validators.required]
    });

    this.resendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.verifyEmail(this.token);
      }
    });
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.verificationMessage = 'Correo electrónico verificado exitosamente.';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.verificationMessage = null;
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const token = this.verifyForm.get('token')?.value;
      this.verifyEmail(token);
    }
  }

  resendVerificationEmail(): void {
    if (this.resendForm.valid) {
      const email = this.resendForm.get('email')?.value;
      this.authService.resendVerificationEmail(email).subscribe({
        next: (response) => {
          this.resendMessage = 'Correo de verificación reenviado exitosamente.';
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.resendMessage = null;
        }
      });
    }
  }

  toggleForm(): void {
    this.showVerifyForm = !this.showVerifyForm;
    this.verificationMessage = null;
    this.resendMessage = null;
  }
}