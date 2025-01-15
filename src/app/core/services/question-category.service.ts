import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionCategoryService {
  private questionCategoryUrl = 'https://api-ingeciencia.onrender.com/question_categories'; // Base URL del endpoint para las categorías de las preguntas

  constructor(private http: HttpClient) { }

  getQuestionCategories(questionId: number): Observable<{ id_question: number, id_categories: number[] }> {
    return this.http.get<{ id_question: number, id_categories: number[] }>(`${this.questionCategoryUrl}/${questionId}`).pipe(
      // tap(response => {console.log('Question categories fetched successfully');}),
      catchError(this.handleError)
    );
  }

  updateQuestionCategories(questionId: number, categories: number[]): Observable<any> {
    return this.http.put<any>(`${this.questionCategoryUrl}/${questionId}`, { id_question: questionId, id_categories: categories }).pipe(
      // tap(response => { console.log('Question categories updated successfully'); }),
      catchError(this.handleError)
    );
  }

  addQuestionCategory(questionId: number, categoryId: number): Observable<any> {
    return this.http.post<any>(this.questionCategoryUrl, { id_question: questionId, id_category: categoryId }).pipe(
      // tap(response => { console.log('Question category added successfully'); }),
      catchError(this.handleError)
    );
  }

  deleteQuestionCategory(questionId: number, categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.questionCategoryUrl}/${questionId}`, { body: { id_category: categoryId } }).pipe(
      // tap(response => { console.log('Question category deleted successfully'); }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Algo salió mal, intenta de nuevo.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}
