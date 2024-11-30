import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ArticleService } from '../../../../../core/services/article.service';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../../../../../core/services/category.service';
import { ArticleCategoryService } from '../../../../../core/services/article-categorie.service';
import { Article } from '../../../../../core/models/article.model';
import { ICategory } from '../../../../../core/models/category.model';


@Component({
  selector: 'app-publi-subir-articulo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publi-subir-articulo.component.html',
  styleUrls: ['./publi-subir-articulo.component.scss']
})
export class PubliSubirArticuloComponent implements OnInit {

  articleForm: FormGroup;
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  searchControl: FormControl = new FormControl(''); // FormControl para el texto de búsqueda
  addedCategories: ICategory[] = [];
  articleCategories: number[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPdf: File | null = null;
  selectedPreviewImg: File | null = null;
  selectedPdfName: string | null = null;
  selectedPreviewImgName: string | null = null;
  isSearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private articleCategoryService: ArticleCategoryService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      doi: ['', Validators.required],
      abstract: [''],
      publication_date: ['', Validators.required],
      link: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // Filtrar categorías cuando cambia el texto de búsqueda
    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
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
      if (fileType === 'pdf') {
        if (file.type !== 'application/pdf') {
          this.errorMessage = 'El archivo debe ser un PDF.';
          return;
        }
        this.selectedPdf = file;
        this.selectedPdfName = file.name;
      } else if (fileType === 'preview_img') {
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
    if (category && category.id !== undefined && !this.addedCategories.some(c => c.id === category.id)) {
      this.addedCategories.push(category);
      this.articleCategories.push(category.id);
      this.searchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCategories = this.categories; // Resetear la lista filtrada
      this.isSearchFocused = false; // Ocultar la lista después de agregar
    }
  }

  removeCategory(category: ICategory): void {
    this.addedCategories = this.addedCategories.filter(c => c.id !== category.id);
    this.articleCategories = this.articleCategories.filter(id => id !== category.id);
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

  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200); // Retraso para permitir el clic en la lista
  }

  submitArticle(): void {
    if (this.articleForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.articleForm.controls).forEach(key => {
      const controlValue = this.articleForm.get(key)?.value;
      formData.append(key, controlValue);
    });

    if (this.selectedPdf) {
      formData.append('pdf', this.selectedPdf, this.selectedPdf.name);
    }

    if (this.selectedPreviewImg) {
      formData.append('preview_img', this.selectedPreviewImg, this.selectedPreviewImg.name);
    }

    this.articleService.uploadArticle(formData).subscribe({
      next: (response) => {
        const articleId = response.id;
        this.articleCategoryService.updateArticleCategories(articleId, this.articleCategories).subscribe({
          next: () => {
            this.successMessage = 'Artículo subido exitosamente';
            this.errorMessage = null;
            this.articleForm.reset();
            this.selectedPdf = null;
            this.selectedPreviewImg = null;
            this.selectedPdfName = null;
            this.selectedPreviewImgName = null;
            this.addedCategories = [];
            this.articleCategories = [];
          },
          error: (err) => {
            console.error('Error updating article categories', err);
            this.errorMessage = 'Error al actualizar las categorías del artículo.';
            this.successMessage = null;
          }
        });
      },
      error: (err) => {
        console.error('Error uploading article', err);
        this.errorMessage = 'Error al subir el artículo';
        this.successMessage = null;
      }
    });
  }
}
