import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../core/services/question.service';
import { QuestionCategoryService } from '../../../../core/services/question-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Question } from '../../../../core/models/question.model';
import { ICategory } from '../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
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
  authors: { [key: number]: Author } = {};
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por pregunta
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;

  constructor(
    private questionService: QuestionService,
    private questionCategoryService: QuestionCategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadQuestions();
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
        this.questions = questions;
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

  viewQuestion(questionId: number): void {
    // Navegar a la vista de la pregunta
  }
}
