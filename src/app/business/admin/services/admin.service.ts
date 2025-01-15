import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/users'; // URL base de la API

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      map(users => users.map(user => {
        if (user.profile_img && user.profile_img.data) {
          const byteArray = new Uint8Array(user.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          user.profile_img_url = URL.createObjectURL(blob);
        }
        return user;
      })),
      catchError(this.handleError)
    );
  }

  updateUserById(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData).pipe(
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
