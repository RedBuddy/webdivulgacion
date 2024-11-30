import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleCategoryService {
  private articleCategoryUrl = 'http://localhost:3000/article_categories'; // Base URL del endpoint para las categorías de los artículos

  constructor(private http: HttpClient) { }

  getArticleCategories(articleId: number): Observable<{ id_article: number, id_categories: number[] }> {
    return this.http.get<{ id_article: number, id_categories: number[] }>(`${this.articleCategoryUrl}/${articleId}`).pipe(
      tap(response => {
        console.log('Article categories fetched successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  updateArticleCategories(articleId: number, categories: number[]): Observable<any> {
    return this.http.put<any>(`${this.articleCategoryUrl}/${articleId}`, { id_article: articleId, id_categories: categories }).pipe(
      tap(response => {
        console.log('Article categories updated successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  addArticleCategory(articleId: number, categoryId: number): Observable<any> {
    return this.http.post<any>(this.articleCategoryUrl, { id_article: articleId, id_category: categoryId }).pipe(
      tap(response => {
        console.log('Article category added successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  deleteArticleCategory(articleId: number, categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.articleCategoryUrl}/${articleId}`, { body: { id_category: categoryId } }).pipe(
      tap(response => {
        console.log('Article category deleted successfully', response);
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

