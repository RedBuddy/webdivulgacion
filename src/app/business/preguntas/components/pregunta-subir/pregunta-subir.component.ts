import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { QuestionService } from '../../../../core/services/question.service';
import { QuestionCategoryService } from '../../../../core/services/question-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../../core/models/category.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { GeminiService } from '../../../../core/services/gemini.service';

@Component({
  selector: 'app-pregunta-subir',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pregunta-subir.component.html',
  styleUrl: './pregunta-subir.component.scss'
})

export class PreguntaSubirComponent implements OnInit {
  questionForm: FormGroup;
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  addedCategories: ICategory[] = [];
  searchControl: FormControl = new FormControl('');
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isCategorySearchFocused: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionService,
    private questionCategoryService: QuestionCategoryService,
    private categoryService: CategoryService,
    private geminiService: GeminiService,
    private authService: AuthService
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      categories: [[]]
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
    this.router.navigate(['preguntas']);
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

  filterCategories(searchText: string): void {
    if (!searchText) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  addCategory(category: ICategory): void {
    if (this.addedCategories.length >= 5) {
      this.errorMessage = 'No puedes agregar más de 5 categorías.';
      return;
    }

    if (category && category.id !== undefined && !this.addedCategories.some(c => c.id === category.id)) {
      this.addedCategories.push(category);
      this.questionForm.get('categories')?.setValue(this.addedCategories.map(c => c.id));
      this.searchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCategories = this.categories; // Resetear la lista filtrada
      this.errorMessage = null; // Clear any previous error messages
    }
  }

  removeCategory(category: ICategory): void {
    this.addedCategories = this.addedCategories.filter(c => c.id !== category.id);
    this.questionForm.get('categories')?.setValue(this.addedCategories.map(c => c.id));
  }



  onCategorySearchFocus(): void {
    this.isCategorySearchFocused = true;
  }

  onCategorySearchBlur(): void {
    setTimeout(() => {
      this.isCategorySearchFocused = false;
    }, 200); // Retraso para permitir el clic en la lista
  }

  VerifyQuestion(): boolean {

    this.geminiService.verifyQuestion(questionData.title, questionData.body).then((response: any) => {
      console.log('Respuesta de gemini' + response);
      if (response === 'false') {
        this.errorMessage = 'El título o el cuerpo de la pregunta no son válidos.';
        return;
      } else {
        this.successMessage = 'Pregunta creada exitosamente';
      }
    });

    return true;
  }


  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData = this.questionForm.value;

      questionData.id_user = this.authService.getUserIdFromToken();
      this.questionService.createQuestion(questionData).subscribe({
        next: (response) => {
          const questionId = response.id;
          this.questionCategoryService.updateQuestionCategories(questionId, this.addedCategories.map(c => c.id)).subscribe({
            next: () => {
              this.successMessage = 'Pregunta creada exitosamente';
              this.errorMessage = null;
              this.questionForm.reset();
              this.addedCategories = [];
              this.filteredCategories = this.categories;
            },
            error: (err) => {
              console.error('Error updating question categories', err);
              this.errorMessage = 'Error al actualizar las categorías de la pregunta.';
            }
          });
        },
        error: (err) => {
          console.error('Error creating question', err);
          this.errorMessage = 'Error al crear la pregunta.';
        }
      });
    }
  }
}
