import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//Servicios
import { QuestionService } from '../../../../core/services/question.service';
import { QuestionCategoryService } from '../../../../core/services/question-category.service';
import { CategoryService } from '../../../../core/services/category.service';
//Modelos
import { Question } from '../../../../core/models/question.model';
import { ICategory } from '../../../../core/models/category.model';
import { Author } from '../../../../core/models/author.model';

@Component({
  selector: 'app-preguntas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-list.component.html',
  styleUrl: './preguntas-list.component.scss'
})

export class PreguntasListComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  authors: { [key: number]: Author } = {};
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por pregunta
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;

  searchControl: FormControl = new FormControl('');
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(
    private questionService: QuestionService,
    private questionCategoryService: QuestionCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadQuestions();

    this.route.queryParams.subscribe(params => {
      const search = params['search'] || '';
      this.searchControl.setValue(search, { emitEvent: false });
      this.filterQuestions(search);
      this.currentPage = 1;
    });

    this.searchControl.valueChanges.subscribe(value => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: value },
        queryParamsHandling: 'merge'
      });
      this.filterQuestions(value);
    });
  }

  loadAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categoryMap = categories.reduce((map, category) => {
          map[category.id] = category;
          return map;
        }, {} as { [key: number]: ICategory });
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (questions: Question[]) => {
        this.questions = questions.filter(question => question.active); // Filtrar solo preguntas activas
        this.filteredQuestions = this.questions;
        this.questions.forEach(question => {
          this.loadAuthorForQuestion(question.id);
          this.loadCategoriesForQuestion(question.id);
        });
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading questions', err);
        this.errorMessage = 'Error al cargar la lista de preguntas.';
      }
    });
  }

  loadAuthorForQuestion(questionId: number): void {
    this.questionService.getAuthorByQuestionId(questionId).subscribe({
      next: (author: Author) => {
        this.authors[questionId] = author;
      },
      error: (err) => {
        console.error('Error loading author for question', err);
      }
    });
  }

  loadCategoriesForQuestion(questionId: number): void {
    this.questionCategoryService.getQuestionCategories(questionId).subscribe({
      next: (response: { id_question: number, id_categories: number[] }) => {
        this.categories[questionId] = response.id_categories.map(id => this.categoryMap[id]);
      },
      error: (err) => {
        console.error('Error loading categories for question', err);
      }
    });
  }

  filterQuestions(searchText: string): void {
    if (!searchText) {
      this.filteredQuestions = this.questions;
    } else {
      this.filteredQuestions = this.questions.filter(question =>
        question.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  get paginatedQuestions(): Question[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredQuestions.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  viewQuestion(questionId: number): void {
    this.router.navigate(['preguntas/detalle', questionId]);
  }
}
