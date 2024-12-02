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
      map(users => users.map(user => {
        if (user.profile_img && user.profile_img.data) {
          const byteArray = new Uint8Array(user.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          user.profile_img_url = this.createImageUrlFromBlob(blob);
        }
        return user;
      })),
      catchError(this.handleError)
    );
  }

  private createImageUrlFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob); // Crear URL temporal para el Blob
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
    return throwError(() => new Error(errorMessage));
  }
}
