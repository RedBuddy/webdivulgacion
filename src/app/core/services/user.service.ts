import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserCard } from '../models/profile_card.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/profile_card';

  constructor(private http: HttpClient) { }

  getUserCard(userId: string): Observable<UserCard> {
    return this.http.get<UserCard>(`${this.apiUrl}/${userId}`).pipe(
      map(userCard => {
        if (userCard.profile_img) {
          const byteArray = new Uint8Array(userCard.profile_img.data);
          const blob = new Blob([byteArray], { type: userCard.profile_img.type });
          userCard.profile_img_url = URL.createObjectURL(blob);
        }
        return userCard;
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
      if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}