import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User_filter } from '../../../core/models/user_filter.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})

export class FitroService {

  private apiUrl = 'http://localhost:3000/user_filter'; // URL del endpoint

  constructor(private http: HttpClient) { }

  filterUsers(searchString: string): Observable<User_filter[]> {
    return this.http.get<User_filter[]>(`${this.apiUrl}/${searchString}`).pipe(
      map(users => users.map(user => ({
        ...user,
        profile_img_url: user.profile_img ? this.convertBufferToUrl(user.profile_img) : null
      }))),
      catchError(this.handleError)
    );
  }

  private convertBufferToUrl(buffer: { type: string; data: number[] }): string {
    const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer.data)));
    return `data:image/png;base64,${base64String}`;
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
      } else {
        errorMessage = `Error: ${error.status}, ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
