import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { IUser } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private updateAccountUrl = 'http://localhost:3000/users'; // Base URL del endpoint para actualizar la cuenta
  private getUserUrl = 'http://localhost:3000/users'; // Base URL del endpoint para obtener los datos del usuario

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

    // Ver el contenido de FormData
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    return this.http.put<any>(`${this.updateAccountUrl}/${userId}`, formData).pipe(
      switchMap(() => this.authService.login(user.email, currentPassword)), // Re-login después de la actualización
      catchError(this.handleError)
    );
  }

  getUser(): Observable<IUser> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    return this.http.get<IUser>(`${this.getUserUrl}/${userId}`).pipe(
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
