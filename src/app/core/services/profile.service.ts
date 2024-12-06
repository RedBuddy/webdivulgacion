import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Profile } from '../models/profile.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = 'http://localhost:3000/profile';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createProfile(profile: Profile): Observable<any> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    profile.id_user = userId;
    return this.http.post<any>(this.profileUrl, profile).pipe(
      tap(response => {
        console.log('Profile created successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(profile: Profile): Observable<any> {
    // const userId = this.authService.getUserIdFromToken();
    // if (userId === null) {
    //   return throwError('User ID not found in token');
    // }
    // profile.id_user = userId;
    // console.log('ID USER:', profile.id_user);
    return this.http.put<any>(`${this.profileUrl}/${profile.id_user}`, profile).pipe(
      tap(response => {
        console.log('Profile updated successfully', response);
      }),
      catchError(this.handleError)
    );
  }

  getProfile(): Observable<Profile> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    return this.http.get<Profile>(`${this.profileUrl}/${userId}`).pipe(
      tap(response => {
        console.log('Profile loaded successfully', response);
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
