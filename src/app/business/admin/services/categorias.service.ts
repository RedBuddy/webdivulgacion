import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICategory } from '../../../core/models/category.model';

@Injectable({
  providedIn: 'root'
})

export class CategoriasService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/categories'; // URL base de la API

  constructor(private http: HttpClient) { }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryById(categoryId: number): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  createCategory(categoryData: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiUrl, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  updateCategoryById(categoryId: number, categoryData: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/${categoryId}`, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${categoryId}`).pipe(
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