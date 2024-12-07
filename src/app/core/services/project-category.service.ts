import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectCategoryService {
  private projectCategoryUrl = 'http://localhost:3000/project_categories'; // Base URL del endpoint para las categorías de los proyectos

  constructor(private http: HttpClient) { }

  getProjectCategories(projectId: number): Observable<{ id_project: number, id_categories: number[] }> {
    return this.http.get<{ id_project: number, id_categories: number[] }>(`${this.projectCategoryUrl}/${projectId}`).pipe(
      tap(response => {
        console.log('Project categories fetched successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  updateProjectCategories(projectId: number, categories: number[]): Observable<any> {
    return this.http.put<any>(`${this.projectCategoryUrl}/${projectId}`, { id_project: projectId, id_categories: categories }).pipe(
      tap(response => {
        console.log('Project categories updated successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  addProjectCategory(projectId: number, categoryId: number): Observable<any> {
    return this.http.post<any>(this.projectCategoryUrl, { id_project: projectId, id_category: categoryId }).pipe(
      tap(response => {
        console.log('Project category added successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  deleteProjectCategory(projectId: number, categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.projectCategoryUrl}/${projectId}`, { body: { id_category: categoryId } }).pipe(
      tap(response => {
        console.log('Project category deleted successfully', response);
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
