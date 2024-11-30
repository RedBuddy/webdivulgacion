import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Article } from '../models/article.model';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://localhost:3000/articles';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserArticles(): Observable<Article[]> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    return this.http.get<Article[]>(`${this.apiUrl}/${userId}`).pipe(
      tap(articles => console.log('User articles loaded:', articles)),
      catchError(this.handleError)
    );
  }

  uploadArticle(articleData: FormData): Observable<Article> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    articleData.append('id_author', userId.toString());
    return this.http.post<Article>(this.apiUrl, articleData).pipe(
      tap(article => console.log('Article uploaded:', article)),
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
