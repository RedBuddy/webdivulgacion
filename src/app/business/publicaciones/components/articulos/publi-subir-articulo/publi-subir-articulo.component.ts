import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ArticleService } from '../../../../../core/services/article.service';
import { ArticleCategoryService } from '../../../../../core/services/article-category.service';
import { ArticleCoauthorService } from '../../../../../core/services/article-coauthor.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../../../core/models/category.model';
import { ICoauthor } from '../../../../../core/models/coauthor.model';
import { Router } from '@angular/router';

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
  coauthors: ICoauthor[] = [];
  filteredCoauthors: ICoauthor[] = [];
  coauthorSearchControl: FormControl = new FormControl(''); // FormControl para el texto de búsqueda de coautores
  addedCoauthors: ICoauthor[] = [];
  articleCoauthors: number[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPdf: File | null = null;
  selectedPreviewImg: File | null = null;
  selectedPdfName: string | null = null;
  selectedPreviewImgName: string | null = null;
  isCategorySearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda de categorías
  isCoauthorSearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda de coautores

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private articleCategoryService: ArticleCategoryService,
    private articleCoauthorService: ArticleCoauthorService,
    private router: Router
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
    this.loadCoauthors();

    // Filtrar categorías cuando cambia el texto de búsqueda
    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });

    // Filtrar coautores cuando cambia el texto de búsqueda
    this.coauthorSearchControl.valueChanges.subscribe(value => {
      this.filterCoauthors(value);
    });
  }

  //Regresar al router mis publicaciones
  regresarRouter(): void {
    this.router.navigate(['mis-publicaciones/mis-articulos']);
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

  loadCoauthors(): void {
    this.articleCoauthorService.getCoauthors().subscribe({
      next: (coauthors: ICoauthor[]) => {
        this.coauthors = coauthors;
        this.filteredCoauthors = coauthors; // Inicialmente, todos los coautores están filtrados
      },
      error: (err) => {
        console.error('Error loading coauthors', err);
        this.errorMessage = 'Error al cargar los coautores.';
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
    if (this.addedCategories.length >= 5) {
      this.errorMessage = 'No puedes agregar más de 5 categorías.';
      return;
    }

    if (category && category.id !== undefined && !this.addedCategories.some(c => c.id === category.id)) {
      this.addedCategories.push(category);
      this.articleCategories.push(category.id);
      this.searchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCategories = this.categories; // Resetear la lista filtrada
      this.isCategorySearchFocused = false; // Ocultar la lista después de agregar
      this.errorMessage = null; // Clear any previous error messages
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

  addCoauthor(coauthor: ICoauthor): void {
    if (coauthor && coauthor.id !== undefined && !this.addedCoauthors.some(c => c.id === coauthor.id)) {
      this.addedCoauthors.push(coauthor);
      this.articleCoauthors.push(coauthor.id);
      this.coauthorSearchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCoauthors = this.coauthors; // Resetear la lista filtrada
      this.isCoauthorSearchFocused = false; // Ocultar la lista después de agregar
    }
  }

  removeCoauthor(coauthor: ICoauthor): void {
    this.addedCoauthors = this.addedCoauthors.filter(c => c.id !== coauthor.id);
    this.articleCoauthors = this.articleCoauthors.filter(id => id !== coauthor.id);
  }

  filterCoauthors(searchText: string): void {
    if (!searchText) {
      this.filteredCoauthors = this.coauthors;
    } else {
      this.filteredCoauthors = this.coauthors.filter(coauthor =>
        `${coauthor.first_name} ${coauthor.last_name}`.toLowerCase().includes(searchText.toLowerCase())
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

  onCoauthorSearchFocus(): void {
    this.isCoauthorSearchFocused = true;
  }

  onCoauthorSearchBlur(): void {
    setTimeout(() => {
      this.isCoauthorSearchFocused = false;
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
            this.articleCoauthorService.updateArticleCoauthors(articleId, this.articleCoauthors).subscribe({
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
                this.addedCoauthors = [];
                this.articleCoauthors = [];
              },
              error: (err) => {
                console.error('Error updating article coauthors', err);
                this.errorMessage = 'Error al actualizar los coautores del artículo.';
                this.successMessage = null;
              }
            });
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
