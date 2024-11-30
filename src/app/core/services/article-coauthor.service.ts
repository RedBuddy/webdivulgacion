import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICoauthor } from '../models/coauthor.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleCoauthorService {
  private articleCoauthorUrl = 'http://localhost:3000/article_coauthors'; // Base URL del endpoint para los coautores de los artículos
  private coauthorsUrl = 'http://localhost:3000/authors'; // Base URL del endpoint para obtener los coautores

  constructor(private http: HttpClient) { }

  getCoauthors(): Observable<ICoauthor[]> {
    return this.http.get<ICoauthor[]>(this.coauthorsUrl).pipe(
      tap(coauthors => {
        console.log('Coauthors fetched successfully', coauthors);
      }),
      catchError(this.handleError)
    );
  }

  getArticleCoauthors(articleId: number): Observable<{ id_article: number, id_coauthors: number[] }> {
    return this.http.get<{ id_article: number, id_coauthors: number[] }>(`${this.articleCoauthorUrl}/${articleId}`).pipe(
      tap(response => {
        console.log('Article coauthors fetched successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  updateArticleCoauthors(articleId: number, coauthors: number[]): Observable<any> {
    return this.http.put<any>(`${this.articleCoauthorUrl}/${articleId}`, { id_article: articleId, id_coauthors: coauthors }).pipe(
      tap(response => {
        console.log('Article coauthors updated successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  addArticleCoauthor(articleId: number, coauthorId: number): Observable<any> {
    return this.http.post<any>(this.articleCoauthorUrl, { id_article: articleId, id_coauthor: coauthorId }).pipe(
      tap(response => {
        console.log('Article coauthor added successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  deleteArticleCoauthor(articleId: number, coauthorId: number): Observable<any> {
    return this.http.delete<any>(`${this.articleCoauthorUrl}/${articleId}`, { body: { id_coauthor: coauthorId } }).pipe(
      tap(response => {
        console.log('Article coauthor deleted successfully', response);
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
