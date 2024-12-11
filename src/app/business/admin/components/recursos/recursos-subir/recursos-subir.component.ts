import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ResourceService } from '../../../../../core/services/resource.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-recursos-subir',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recursos-subir.component.html',
  styleUrl: './recursos-subir.component.scss'
})

export class RecursosSubirComponent implements OnInit {
  resourceForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPdfName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private resourceService: ResourceService,
    private authService: AuthService
  ) {
    this.resourceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      resource_category: ['', Validators.required],
      link: [''],
      pdf: [null]
    });
  }

  ngOnInit(): void { }

  regresarRouter(): void {
    this.router.navigate(['admin/recurso']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedPdfName = file.name;
    if (file) {
      this.resourceForm.patchValue({
        pdf: file
      });
    }
  }

  onSubmit(): void {
    if (this.resourceForm.valid) {
      let userId = this.authService.getUserIdFromToken();
      if (userId === null) {
        this.errorMessage = 'No se pudo obtener el ID del usuario.';
        return;
      }

      const resourceData = new FormData();
      resourceData.append('title', this.resourceForm.get('title')?.value);
      resourceData.append('description', this.resourceForm.get('description')?.value);
      resourceData.append('resource_category', this.resourceForm.get('resource_category')?.value);
      resourceData.append('link', this.resourceForm.get('link')?.value);
      resourceData.append('pdf', this.resourceForm.get('pdf')?.value);
      resourceData.append('id_author', userId.toString());

      this.resourceService.createResource(resourceData).subscribe({
        next: () => {
          this.successMessage = 'Recurso creado exitosamente';
          this.errorMessage = null;
          this.resourceForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}
