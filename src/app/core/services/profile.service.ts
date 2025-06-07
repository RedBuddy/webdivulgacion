import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Profile } from '../models/profile.model';
import { AuthService } from '../services/auth.service';
import { UserCard } from '../models/profile_card.model';
import { UserAbout } from '../models/user_about.model';
import { User_filter } from '../models/user_filter.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = environment.apiUrl + '/profile';
  private profileCardUrl = environment.apiUrl + '/profile_card';
  private userAboutUrl = environment.apiUrl + '/profile_about';
  private authorListUrl = environment.apiUrl + '/authors_profile';
  private adminListUrl = environment.apiUrl + '/admins_profile';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createProfile(profile: Profile): Observable<any> {
    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      return throwError('User ID not found in token');
    }
    profile.id_user = userId;
    return this.http.post<any>(this.profileUrl, profile).pipe(
      tap(response => {
        console.log('Profile created successfully');
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(profile: Profile): Observable<any> {
    return this.http.put<any>(`${this.profileUrl}/${profile.id_user}`, profile).pipe(
      tap(response => {
        console.log('Profile updated successfully');
      }),
      catchError(this.handleError)
    );
  }

  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.profileUrl}/${userId}`).pipe(
      tap(response => {
        console.log('Profile loaded successfully');
      }),
      catchError(this.handleError)
    );
  }

  getUserCard(userId: string): Observable<UserCard> {
    return this.http.get<UserCard>(`${this.profileCardUrl}/${userId}`).pipe(
      map(userCard => {
        if (userCard.profile_img) {
          const byteArray = new Uint8Array(userCard.profile_img.data);
          const blob = new Blob([byteArray], { type: userCard.profile_img.type });
          userCard.profile_img_url = URL.createObjectURL(blob);
        }
        return userCard;
      }),
      catchError(this.handleError)
    );
  }

  getUserAbout(userId: string): Observable<UserAbout> {
    return this.http.get<UserAbout>(`${this.userAboutUrl}/${userId}`).pipe(
      tap(response => {
        console.log('User about loaded successfully');
      }),
      catchError(this.handleError)
    );
  }

  getAuthorList(): Observable<User_filter[]> {
    return this.http.get<User_filter[]>(this.authorListUrl).pipe(
      map(authors => authors.map(author => {
        if (author.profile_img) {
          const byteArray = new Uint8Array(author.profile_img.data);
          const blob = new Blob([byteArray], { type: author.profile_img.type });
          author.profile_img_url = URL.createObjectURL(blob);
        }
        return author;
      })),
      catchError(this.handleError)
    );
  }

  getAdminList(): Observable<User_filter[]> {
    return this.http.get<User_filter[]>(this.adminListUrl).pipe(
      map(authors => authors.map(author => {
        if (author.profile_img) {
          const byteArray = new Uint8Array(author.profile_img.data);
          const blob = new Blob([byteArray], { type: author.profile_img.type });
          author.profile_img_url = URL.createObjectURL(blob);
        }
        return author;
      })),
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
