import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IUserDiscipline } from '../../../core/models/user_discipline.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class UserDisciplineService {
  private userDisciplineUrl = 'http://localhost:3000/user_disciplines'; // Base URL del endpoint para las disciplinas del usuario

  constructor(private http: HttpClient) { }

  getUserDisciplines(userId: number): Observable<IUserDiscipline[]> {
    return this.http.get<IUserDiscipline[]>(`${this.userDisciplineUrl}/${userId}`).pipe(
      tap(disciplines => {
        console.log('User disciplines fetched successfully', disciplines);
      }),
      catchError(this.handleError)
    );
  }

  updateUserDisciplines(userId: number, disciplines: number[]): Observable<any> {
    return this.http.put<any>(`${this.userDisciplineUrl}/${userId}`, { disciplines }).pipe(
      tap(response => {
        console.log('User disciplines updated successfully', response);
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
