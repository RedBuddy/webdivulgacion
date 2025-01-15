import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User_filter } from '../../../core/models/user_filter.model';
import { Article } from '../../../core/models/article.model';

@Injectable({
  providedIn: 'root'
})

export class FitroService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/user_filter'; // URL del endpoint
  private articleUrl = 'https://api-ingeciencia.onrender.com/article_filter';

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

  filterArticles(searchString: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.articleUrl}/${searchString}`).pipe(
      map(articles => articles.map(article => {
        if (article.preview_img && article.preview_img.data) {
          const byteArray = new Uint8Array(article.preview_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          article.preview_img_url = this.createImageUrlFromBlob(blob);
        }
        return article;
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
