import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ResearchProjectsService } from '../../../../../core/services/research-projects.service';
import { ProjectCategoryService } from '../../../../../core/services/project-category.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../../../core/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publi-subir-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publi-subir-proyecto.component.html',
  styleUrls: ['./publi-subir-proyecto.component.scss']
})
export class PubliSubirProyectoComponent implements OnInit {

  projectForm: FormGroup;
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  searchControl: FormControl = new FormControl(''); // FormControl para el texto de búsqueda
  addedCategories: ICategory[] = [];
  projectCategories: number[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPreviewImg: File | null = null;
  selectedPreviewImgName: string | null = null;
  isCategorySearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda de categorías

  constructor(
    private fb: FormBuilder,
    private researchProjectsService: ResearchProjectsService,
    private categoryService: CategoryService,
    private projectCategoryService: ProjectCategoryService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      details: [''],
      vacancies: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // Filtrar categorías cuando cambia el texto de búsqueda
    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
  }

  //Regresar al router mis publicaciones
  regresarRouter(): void {
    this.router.navigate(['mis-publicaciones/mis-proyectos']);
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categories = categories;
        this.filteredCategories = categories; // Inicialmente, todas las categorías están filtradas
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage = 'Error al cargar las categorías.';
      }
    });
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (fileType === 'preview_img') {
        if (!file.type.startsWith('image/')) {
          this.errorMessage = 'El archivo debe ser una imagen.';
          return;
        }
        this.selectedPreviewImg = file;
        this.selectedPreviewImgName = file.name;
      }
      this.errorMessage = null; // Clear any previous error messages
    }
  }

  addCategory(category: ICategory): void {
    if (this.addedCategories.length >= 5) {
      this.errorMessage = 'No puedes agregar más de 5 categorías.';
      return;
    }

    if (category && category.id !== undefined && !this.addedCategories.some(c => c.id === category.id)) {
      this.addedCategories.push(category);
      this.projectCategories.push(category.id);
      this.searchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCategories = this.categories; // Resetear la lista filtrada
      this.isCategorySearchFocused = false; // Ocultar la lista después de agregar
      this.errorMessage = null; // Clear any previous error messages
    }
  }

  removeCategory(category: ICategory): void {
    this.addedCategories = this.addedCategories.filter(c => c.id !== category.id);
    this.projectCategories = this.projectCategories.filter(id => id !== category.id);
  }

  filterCategories(searchText: string): void {
    if (!searchText) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  onCategorySearchFocus(): void {
    this.isCategorySearchFocused = true;
  }

  onCategorySearchBlur(): void {
    setTimeout(() => {
      this.isCategorySearchFocused = false;
    }, 200); // Retraso para permitir el clic en la lista
  }

  submitProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.projectForm.controls).forEach(key => {
      const controlValue = this.projectForm.get(key)?.value;
      formData.append(key, controlValue);
    });

    if (this.selectedPreviewImg) {
      formData.append('preview_img', this.selectedPreviewImg, this.selectedPreviewImg.name);
    }

    this.researchProjectsService.uploadProject(formData).subscribe({
      next: (response) => {
        const projectId = response.id;
        this.projectCategoryService.updateProjectCategories(projectId, this.projectCategories).subscribe({
          next: () => {
            this.successMessage = 'Proyecto subido exitosamente';
            this.errorMessage = null;
            this.projectForm.reset();
            this.selectedPreviewImg = null;
            this.selectedPreviewImgName = null;
            this.addedCategories = [];
            this.projectCategories = [];
          },
          error: (err) => {
            console.error('Error updating project categories', err);
            this.errorMessage = 'Error al actualizar las categorías del proyecto.';
            this.successMessage = null;
          }
        });
      },
      error: (err) => {
        console.error('Error uploading project', err);
        this.errorMessage = 'Error al subir el proyecto';
        this.successMessage = null;
      }
    });
  }
}
