import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Profile } from '../models/profile.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = 'http://localhost:3000/profile'; // URL base del backend para el perfil

  constructor(private http: HttpClient) { }

  // Método para cargar el perfil
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.profileUrl).pipe(
      tap(profile => console.log('Profile loaded:', profile)),
      catchError(error => {
        console.error('Error loading profile:', error);
        return throwError(error);
      })
    );
  }

  // Método para actualizar el perfil
  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.profileUrl, profile).pipe(
      tap(updatedProfile => console.log('Profile updated:', updatedProfile)),
      catchError(error => {
        console.error('Error updating profile:', error);
        return throwError(error);
      })
    );
  }
}
