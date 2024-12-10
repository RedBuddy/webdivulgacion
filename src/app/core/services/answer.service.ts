import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Answer } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})

export class AnswerService {

  private apiUrl = 'http://localhost:3000/answers';

  constructor(private http: HttpClient) { }

  createAnswer(questionId: number, userId: number, body: string): Observable<Answer> {
    const answerData = {
      body: body,
      id_question: questionId,
      id_user: userId
    };
    return this.http.post<Answer>(this.apiUrl, answerData).pipe(
      catchError(this.handleError)
    );
  }

  getAnswersByQuestionId(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${questionId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Algo salió mal, intenta de nuevo.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error.message || 'Error del servidor';
    }
    console.error('An error occurred:', errorMessage);
    return throwError({ status: error.status, message: errorMessage });
  }
}