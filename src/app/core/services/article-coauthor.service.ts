import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ICoauthor } from '../models/coauthor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleCoauthorService {
  private articleCoauthorUrl = environment.apiUrl + '/article_coauthors'; // Base URL del endpoint para los coautores de los artículos
  private coauthorsUrl = environment.apiUrl + '/authors'; // Base URL del endpoint para obtener los coautores

  constructor(private http: HttpClient) { }

  getCoauthors(): Observable<ICoauthor[]> {
    return this.http.get<ICoauthor[]>(this.coauthorsUrl).pipe(
      map((coauthors: ICoauthor[]) => coauthors.map((coauthor: ICoauthor) => {
        if (coauthor.profile_img && coauthor.profile_img.data) {
          const byteArray = new Uint8Array(coauthor.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          coauthor.profile_img_url = this.createImageUrlFromBlob(blob);
        }
        return coauthor;
      })),
      tap(coauthors => {
        console.log('Coauthors fetched successfully');
      }),
      catchError(this.handleError)
    );
  }

  private createImageUrlFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob); // Crear URL temporal para el Blob
  }

  getArticleCoauthors(articleId: number): Observable<ICoauthor[]> {
    return this.http.get<ICoauthor[]>(`${this.articleCoauthorUrl}/${articleId}`).pipe(
      map((coauthors: ICoauthor[]) => coauthors.map((coauthor: ICoauthor) => {
        if (coauthor.profile_img && coauthor.profile_img.data) {
          const byteArray = new Uint8Array(coauthor.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          coauthor.profile_img_url = this.createImageUrlFromBlob(blob);
        }
        return coauthor;
      })),
      tap(coauthors => {
        console.log('Article coauthors fetched successfully');
      }),
      catchError(this.handleError)
    );
  }

  updateArticleCoauthors(articleId: number, coauthors: number[]): Observable<any> {
    return this.http.put<any>(`${this.articleCoauthorUrl}/${articleId}`, { id_article: articleId, id_coauthors: coauthors }).pipe(
      tap(response => {
        console.log('Article coauthors updated successfully');
      }),
      catchError(this.handleError)
    );
  }

  addArticleCoauthor(articleId: number, coauthorId: number): Observable<any> {
    return this.http.post<any>(this.articleCoauthorUrl, { id_article: articleId, id_coauthor: coauthorId }).pipe(
      tap(response => {
        console.log('Article coauthor added successfully');
      }),
      catchError(this.handleError)
    );
  }

  deleteArticleCoauthor(articleId: number, coauthorId: number): Observable<any> {
    return this.http.delete<any>(`${this.articleCoauthorUrl}/${articleId}`, { body: { id_coauthor: coauthorId } }).pipe(
      tap(response => {
        console.log('Article coauthor deleted successfully');
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
