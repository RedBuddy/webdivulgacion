import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResearchProjectsService } from '../../../../../core/services/research-projects.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { ProjectCategoryService } from '../../../../../core/services/project-category.service';
import { ResearchProject } from '../../../../../core/models/research-project.model';
import { ICategory } from '../../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-publi-edit-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publi-edit-proyecto.component.html',
  styleUrls: ['./publi-edit-proyecto.component.scss']
})
export class PubliEditProyectoComponent implements OnInit {
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
  projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private researchProjectsService: ResearchProjectsService,
    private categoryService: CategoryService,
    private projectCategoryService: ProjectCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      details: [''],
      vacancies: [''],
      status: ['active', Validators.required] // Agregar el campo de estado
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.loadProject(this.projectId);
    }
    this.loadCategories();

    // Filtrar categorías cuando cambia el texto de búsqueda
    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
  }

  loadProject(projectId: number): void {
    this.researchProjectsService.getProjectById(projectId).subscribe({
      next: (project: ResearchProject) => {
        this.projectForm.patchValue(project);
        this.loadProjectCategories(projectId);
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.errorMessage = 'Error al cargar el proyecto.';
      }
    });
  }

  loadProjectCategories(projectId: number): void {
    this.projectCategoryService.getProjectCategories(projectId).subscribe({
      next: (response: { id_project: number, id_categories: number[] }) => {
        this.projectCategories = response.id_categories;
        this.updateAddedCategories(); // Actualizar addedCategories después de cargar las categorías del proyecto
      },
      error: (err) => {
        console.error('Error loading project categories', err);
        if (err.status !== 404) {
          this.errorMessage = 'Error al cargar las categorías del proyecto.';
        }
      }
    });
  }

  updateAddedCategories(): void {
    if (this.categories.length > 0 && this.projectCategories.length > 0) {
      this.addedCategories = this.categories.filter(category => category.id !== undefined && this.projectCategories.includes(category.id));
    } else {
      this.addedCategories = [];
    }
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

    if (this.projectId) {
      this.researchProjectsService.updateProject(this.projectId, formData).subscribe({
        next: () => {
          if (this.projectId !== null) {
            this.updateProjectCategories(this.projectId, this.projectCategories);
          }
          this.successMessage = 'Proyecto actualizado exitosamente';
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Error updating project', err);
          this.errorMessage = 'Error al actualizar el proyecto';
          this.successMessage = null;
        }
      });
    }
  }

  updateProjectCategories(projectId: number, categories: number[]): void {
    this.projectCategoryService.updateProjectCategories(projectId, categories).subscribe({
      next: (response) => {
        console.log('Project categories updated successfully', response);
      },
      error: (err) => {
        console.error('Error updating project categories', err);
        this.errorMessage = 'Error al actualizar las categorías del proyecto.';
      }
    });
  }

  regresarRouter(): void {
    this.router.navigate(['mis-publicaciones/mis-proyectos']);
  }
}