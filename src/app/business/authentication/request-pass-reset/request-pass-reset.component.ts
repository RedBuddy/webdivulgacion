import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-pass-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-pass-reset.component.html',
  styleUrls: ['./request-pass-reset.component.scss']
})

export default class RequestPassResetComponent implements OnInit {
  requestForm: FormGroup;
  resetMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const email = this.requestForm.get('email')?.value;
      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.resetMessage = 'Correo de restablecimiento de contraseña enviado exitosamente.';
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.resetMessage = null;
        }
      });
    }
  }
}
