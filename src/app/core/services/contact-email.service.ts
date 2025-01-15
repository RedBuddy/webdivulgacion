import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactEmailService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/contact'; // URL base de la API

  constructor(private http: HttpClient) { }

  sendContactMessage(userId: number, emailTo: string, subject: string, message: string): Observable<any> {
    const body = {
      user_id: userId,
      email_to: emailTo,
      subject: subject,
      message: message
    };
    return this.http.post<any>(this.apiUrl, body).pipe(
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
    return throwError({ status: error.status, message: errorMessage });
  }
}