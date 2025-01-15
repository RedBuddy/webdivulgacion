import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { IUser, IUser_data } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private userUrl = 'https://api-ingeciencia.onrender.com/user_data';
  private userUpdateUrl = 'https://api-ingeciencia.onrender.com/user_update';

  constructor(private http: HttpClient, private authService: AuthService) { }

  updateAccount(user: IUser, currentPassword: string, newPassword: string, profileImg?: File): Observable<any> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }

    const formData = new FormData();
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    formData.append('email', user.email);
    formData.append('current_password', currentPassword); // Confirmar la contraseña actual
    formData.append('new_password', newPassword); // Nueva contraseña
    if (profileImg) {
      formData.append('profile_img', profileImg, 'profile_img');
    }

    return this.http.put<any>(`${this.userUpdateUrl}/${userId}`, formData).pipe(
      switchMap(() => this.authService.first_login(user.email, currentPassword)), // Re-login después de la actualización
      catchError(this.handleError)
    );
  }

  getUser(): Observable<IUser_data> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    return this.http.get<IUser_data>(`${this.userUrl}/${userId}`).pipe(
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
      if (error.error && error.error.message) {
        errorMessage = `${error.error.message}`;
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}
