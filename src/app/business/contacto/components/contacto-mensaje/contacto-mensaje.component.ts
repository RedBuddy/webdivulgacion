import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactEmailService } from '../../../../core/services/contact-email.service';
import { AuthService } from '../../../../core/services/auth.service';
import { GeminiService } from '../../../../core/services/gemini.service';

@Component({
  selector: 'app-contacto-mensaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto-mensaje.component.html',
  styleUrls: ['./contacto-mensaje.component.scss']
})

export class ContactoMensajeComponent implements OnInit {
  contactForm: FormGroup;
  recipientEmail: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private contactEmailService: ContactEmailService,
    private authService: AuthService,
    private geminiService: GeminiService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipientEmail = params['email'] || null;
    });

    if (!this.recipientEmail) {
      this.router.navigate(['inicio']);
    }
  }

  VerifyEmail(): Promise<boolean> {
    const contactData = this.contactForm.value;
    return this.geminiService.verifyEmail(contactData.subject, contactData.message).then((response: boolean) => {
      console.log('Respuesta: ' + response);
      return response;
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const { subject, message } = this.contactForm.value;
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.errorMessage = 'Error al obtener el ID del usuario.';
        return;
      }

      this.VerifyEmail().then((isValid) => {
        if (!isValid) {
          this.errorMessage = 'El mensaje de contacto contiene contenido inadecuado.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
          return;
        }


        if (this.recipientEmail) {
          this.contactEmailService.sendContactMessage(userId, this.recipientEmail, subject, message).subscribe({
            next: (response) => {
              this.successMessage = 'Mensaje de contacto enviado exitosamente.';
              this.errorMessage = null;
            },
            error: (err) => {
              // console.error('Error sending contact message', err);
              this.errorMessage = err.message || 'Error al enviar el mensaje de contacto.';
              this.successMessage = null;
            }
          });
        }
      });
    }
  }
}
