import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Answer } from '../models/answer.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AnswerService {

  // Usa la URL de la API desde environment
  private apiUrl = environment.apiUrl + '/answers';

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
      map(answers => answers.map(answer => {
        if (answer.user.profile_img) {
          const byteArray = new Uint8Array(answer.user.profile_img.data);
          const blob = new Blob([byteArray], { type: answer.user.profile_img.type });
          answer.user.profile_img_url = URL.createObjectURL(blob);
        }
        return answer;
      })),
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