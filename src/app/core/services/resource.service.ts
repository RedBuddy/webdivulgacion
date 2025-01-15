import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from '../models/resource.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private apiUrl = 'https://api-ingeciencia.onrender.com/resources'; // URL base de la API

  constructor(private http: HttpClient) { }

  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl).pipe(
      map(resources => resources.map(resource => {
        if (resource.pdf) {
          const byteArray = new Uint8Array(resource.pdf.data);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          resource.pdf_url = URL.createObjectURL(blob);
        }
        return resource;
      })),
      catchError(this.handleError)
    );
  }

  getResourceById(resourceId: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${resourceId}`).pipe(
      map(resource => {
        if (resource.pdf) {
          const byteArray = new Uint8Array(resource.pdf.data);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          resource.pdf_url = URL.createObjectURL(blob);
        }
        return resource;
      }),
      catchError(this.handleError)
    );
  }

  getAuthorByResourceId(resourceId: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/author/${resourceId}`).pipe(
      map(author => {
        if (author.profile_img && author.profile_img.data) {
          const byteArray = new Uint8Array(author.profile_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          author.profile_img_url = URL.createObjectURL(blob);
        }
        return author;
      }),
      // tap(author => console.log('Author loaded')),
      catchError(this.handleError)
    );
  }

  createResource(resourceData: FormData): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resourceData).pipe(
      catchError(this.handleError)
    );
  }

  updateResource(resourceId: number, resourceData: FormData): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${resourceId}`, resourceData).pipe(
      catchError(this.handleError)
    );
  }

  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resourceId}`).pipe(
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
