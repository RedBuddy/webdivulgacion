import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ResearchProject } from '../models/research-project.model';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ResearchProjectsService {

  private apiUrl = environment.apiUrl + '/research_projects';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllProjects(): Observable<ResearchProject[]> {
    return this.http.get<ResearchProject[]>(this.apiUrl).pipe(
      map(projects => projects.map(project => {
        if (project.preview_img && project.preview_img.data) {
          const byteArray = new Uint8Array(project.preview_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          project.preview_img_url = this.createImageUrlFromBlob(blob);
        }
        return project;
      })),
      tap(projects => console.log('All projects loaded')),
      catchError(this.handleError)
    );
  }

  getUserProjects(userId: number): Observable<ResearchProject[]> {
    return this.http.get<ResearchProject[]>(`${this.apiUrl}/user_id/${userId}`).pipe(
      map(projects => projects.map(project => {
        if (project.preview_img && project.preview_img.data) {
          const byteArray = new Uint8Array(project.preview_img.data);
          const blob = new Blob([byteArray], { type: 'image/png' });
          project.preview_img_url = this.createImageUrlFromBlob(blob);
        }
        return project;
      })),
      tap(projects => console.log('User projects loaded')),
      catchError(this.handleError)
    );
  }

  getProjectById(projectId: number): Observable<ResearchProject> {
    return this.http.get<ResearchProject>(`${this.apiUrl}/${projectId}`).pipe(
      tap(project => console.log('Project loaded')),
      catchError(this.handleError)
    );
  }

  getAuthorByProjectId(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author/${projectId}`).pipe(
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

  uploadProject(projectData: FormData): Observable<ResearchProject> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    projectData.append('id_author', userId.toString());
    return this.http.post<ResearchProject>(this.apiUrl, projectData).pipe(
      tap(project => console.log('Project uploaded')),
      catchError(this.handleError)
    );
  }

  updateProject(projectId: number, projectData: FormData): Observable<ResearchProject> {
    return this.http.put<ResearchProject>(`${this.apiUrl}/${projectId}`, projectData).pipe(
      tap(project => console.log('Project updated')),
      catchError(this.handleError)
    );
  }

  deleteProjectById(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`).pipe(
      tap(() => console.log('Project deleted')),
      catchError(this.handleError)
    );
  }

  filterProjects(searchString: string): Observable<ResearchProject[]> {
    return this.http.get<ResearchProject[]>(`${this.apiUrl}/search/${searchString}`).pipe(
      tap(projects => console.log('Filtered projects loaded')),
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
