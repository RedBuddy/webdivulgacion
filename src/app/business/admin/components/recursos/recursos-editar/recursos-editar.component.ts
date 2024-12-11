import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ResourceService } from '../../../../../core/services/resource.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { Resource } from '../../../../../core/models/resource.model';

@Component({
  selector: 'app-recursos-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recursos-editar.component.html',
  styleUrl: './recursos-editar.component.scss'
})

export class RecursosEditarComponent implements OnInit {
  resourceForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPdfName: string | null = null;
  resourceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resourceId = +params['id'];
      this.loadResource(this.resourceId);
    });
  }

  regresarRouter(): void {
    this.router.navigate(['admin/recurso']);
  }

  loadResource(resourceId: number): void {
    this.resourceService.getResourceById(resourceId).subscribe({
      next: (resource: Resource) => {
        this.resourceForm.patchValue({
          title: resource.title,
          description: resource.description,
          resource_category: resource.resource_category,
          link: resource.link
        });
        this.selectedPdfName = resource.pdf ? 'Archivo PDF existente' : null;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el recurso.';
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'El archivo debe ser un PDF.';
        this.resourceForm.patchValue({
          pdf: null
        });
        this.selectedPdfName = null;
      } else {
        this.selectedPdfName = file.name;
        this.resourceForm.patchValue({
          pdf: file
        });
        this.errorMessage = null;
      }
    }
  }

  onSubmit(): void {
    if (this.resourceForm.valid && this.resourceId !== null) {
      // let userId = this.authService.getUserIdFromToken();
      // if (userId === null) {
      //   this.errorMessage = 'No se pudo obtener el ID del usuario.';
      //   return;
      // }
      const resourceData = new FormData();
      resourceData.append('title', this.resourceForm.get('title')?.value);
      resourceData.append('description', this.resourceForm.get('description')?.value);
      resourceData.append('resource_category', this.resourceForm.get('resource_category')?.value);
      resourceData.append('link', this.resourceForm.get('link')?.value);
      if (this.resourceForm.get('pdf')?.value) {
        resourceData.append('pdf', this.resourceForm.get('pdf')?.value);
      }
      // resourceData.append('id_user', userId.toString());

      this.resourceService.updateResource(this.resourceId, resourceData).subscribe({
        next: () => {
          this.successMessage = 'Recurso actualizado exitosamente';
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}
