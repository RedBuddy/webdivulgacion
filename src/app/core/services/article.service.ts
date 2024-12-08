import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Article } from '../models/article.model';
import { Author } from '../models/author.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://localhost:3000/articles';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl).pipe(
      map(articles => articles.map(article => {
        if (article.preview_img && article.preview_img.data) {
          const byteArray = new Uint8Array(article.preview_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          article.preview_img_url = this.createImageUrlFromBlob(blob);
        }
        return article;
      })),
      tap(articles => console.log('All articles loaded')),
      catchError(this.handleError)
    );
  }

  getUserArticles(): Observable<Article[]> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    return this.http.get<Article[]>(`${this.apiUrl}/user_id/${userId}`).pipe(
      tap(articles => console.log('User articles loaded')),
      catchError(this.handleError)
    );
  }

  getAuthorByArticleId(articleId: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/author/${articleId}`).pipe(
      map(author => {
        if (author.profile_img && author.profile_img.data) {
          const byteArray = new Uint8Array(author.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          author.profile_img_url = this.createImageUrlFromBlob(blob);
        }
        return author;
      }),
      tap(author => console.log('Author loaded')),
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
      tap(article => console.log('Article uploaded')),
      catchError(this.handleError)
    );
  }

  updateArticle(articleId: number, articleData: FormData): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${articleId}`, articleData).pipe(
      tap(article => console.log('Article updated')),
      catchError(this.handleError)
    );
  }

  getArticleById(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${articleId}`).pipe(
      tap(article => console.log('Article loaded')),
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
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}
