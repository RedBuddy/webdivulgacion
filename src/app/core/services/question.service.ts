import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Question } from '../models/question.model';
import { Author } from '../models/author.model'; // Add this line to import Author

@Injectable({
  providedIn: 'root'
})

export class QuestionService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/questions'; // URL base de la API

  constructor(private http: HttpClient) { }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserQuestions(userId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/user_id/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getQuestionById(questionId: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${questionId}`).pipe(
      catchError(this.handleError)
    );
  }

  createQuestion(questionData: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, questionData).pipe(
      catchError(this.handleError)
    );
  }

  updateQuestion(questionId: number, questionData: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${questionId}`, questionData).pipe(
      catchError(this.handleError)
    );
  }

  disableQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/disable/${questionId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAuthorByQuestionId(questionId: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/author/${questionId}`).pipe(
      map(author => {
        if (author.profile_img && author.profile_img.data) {
          const byteArray = new Uint8Array(author.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          author.profile_img_url = URL.createObjectURL(blob);
        }
        return author;
      }),
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
      errorMessage = error.error.message || 'Error del servidor';
    }
    console.error('An error occurred:', errorMessage);
    return throwError({ status: error.status, message: errorMessage });
  }
}
