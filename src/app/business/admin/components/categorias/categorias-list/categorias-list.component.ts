import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriasService } from '../../../services/categorias.service';
import { ICategory } from '../../../../../core/models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias-list.component.html',
  styleUrl: './categorias-list.component.scss'
})
export class CategoriasListComponent implements OnInit {
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  editForm: FormGroup;
  addForm: FormGroup;
  searchControl: FormControl = new FormControl(''); // Control para el cuadro de búsqueda
  editingCategoryId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math;

  constructor(private categoriasService: CategoriasService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      category_name: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      category_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
  }

  loadCategories(): void {
    this.categoriasService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categories = categories;
        this.filteredCategories = categories;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage = 'Error al cargar la lista de categorías.';
      }
    });
  }

  filterCategories(searchText: string): void {
    if (!searchText) {
      this.filteredCategories = this.categories;
    } else {
      const lowerSearchText = searchText.toLowerCase();
      this.filteredCategories = this.categories.filter(category =>
        category.category_name.toLowerCase().includes(lowerSearchText)
      );
    }
  }

  startEditing(category: ICategory): void {
    this.editingCategoryId = category.id;
    this.editForm.patchValue({
      category_name: category.category_name
    });
  }

  cancelEditing(): void {
    this.editingCategoryId = null;
    this.editForm.reset();
  }

  saveCategory(): void {
    if (this.editForm.valid && this.editingCategoryId !== null) {
      const updatedCategory = this.editForm.value;
      this.categoriasService.updateCategoryById(this.editingCategoryId, updatedCategory).subscribe({
        next: (category: ICategory) => {
          const index = this.categories.findIndex(c => c.id === this.editingCategoryId);
          if (index !== -1) {
            // Actualizar la categoría en la lista con los valores del formulario
            this.categories[index] = { ...this.categories[index], ...updatedCategory };
            this.filteredCategories = this.categories; // Actualizar la lista filtrada
          }
          this.successMessage = 'Categoría actualizada exitosamente';
          this.errorMessage = null;
          this.editingCategoryId = null;
          this.editForm.reset();
          setTimeout(() => {
            this.successMessage = null;
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      });
    }
  }

  addCategory(): void {
    if (this.addForm.valid) {
      const newCategory = this.addForm.value;
      this.categoriasService.createCategory(newCategory).subscribe({
        next: (category: ICategory) => {
          this.categories.push(category);
          this.filteredCategories = this.categories; // Actualizar la lista filtrada
          this.successMessage = 'Categoría agregada exitosamente';
          this.errorMessage = null;
          this.addForm.reset();
          setTimeout(() => {
            this.successMessage = null;
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      });
    }
  }

  get paginatedCategories(): ICategory[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
