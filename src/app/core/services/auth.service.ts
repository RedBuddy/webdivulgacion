import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url: string = 'http://localhost:3000/login';
  private register_url: string = 'http://localhost:3000/users';
  private profile_img_url: string = 'http://localhost:3000/users/profile_img';
  private tokenKey = 'auth_token';
  private refresh_url: string = 'http://localhost:3000/refresh-token';
  private RefreshTokenKey = 'refresh_token';
  private userImageKey = 'user_image';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRole());
  userRole$ = this.userRoleSubject.asObservable();

  private userImageSubject = new BehaviorSubject<string | null>(this.getUserImageFromStorage());
  userImage$ = this.userImageSubject.asObservable();

  constructor(private HttpClient: HttpClient, private router: Router) { }

  login(identifier: string, password: string): Observable<any> {
    return this.HttpClient.post<any>(this.login_url, { identifier, password }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(this.getUserRole());
          this.fetchUserProfileImage(this.getUserIdFromToken(res.token)); // Obtener la imagen del usuario
          this.router.navigate(['/inicio']);
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  register(formData: FormData): Observable<any> {
    return this.HttpClient.post<any>(this.register_url, formData).pipe(
      switchMap(res => this.login(formData.get('email') as string, formData.get('password') as string)),
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(this.getUserRole());
          this.fetchUserProfileImage(this.getUserIdFromToken(res.token)); // Obtener la imagen del usuario
          this.router.navigate(['/inicio']);
        }
      }),
      catchError(error => {
        console.error('Error during registration:', error);
        return throwError(error);
      })
    );
  }

  private fetchUserProfileImage(userId: number | null): void {
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    this.HttpClient.get(`${this.profile_img_url}/${userId}`, { responseType: 'blob' }).pipe(
      tap(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          this.userImageSubject.next(imageUrl);
          this.setUserImage(imageUrl); // Guardar la imagen en el localStorage
        };
        reader.readAsDataURL(blob);
      }),
      catchError(error => {
        console.error('Error fetching user profile image:', error);
        return throwError(error);
      })
    ).subscribe();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.RefreshTokenKey, refreshToken);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.RefreshTokenKey);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token found');
      return throwError('No refresh token found');
    }

    return this.HttpClient.post<any>(this.refresh_url, { refreshToken }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
        } else {
          console.error('No token in response');
        }
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        return throwError(error);
      })
    );
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if (!token) {
      console.error('No token found for auto-refresh');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const timeout = exp - Date.now() - 60000; // Refresh 1 minute before expiration

    if (timeout > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    } else {
      console.error('Token already expired');
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  getUserRole(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null; // Asume que el rol está en el campo 'role' del payload
  }

  getUserIdFromToken(token: string): number | null {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.RefreshTokenKey);
    localStorage.removeItem(this.userImageKey);
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.userImageSubject.next(null);
    this.router.navigate(['/inicio']);
  }

  private setUserImage(imageUrl: string): void {
    localStorage.setItem(this.userImageKey, imageUrl);
  }

  private getUserImageFromStorage(): string | null {
    return localStorage.getItem(this.userImageKey);
  }

  getUserImage(): string | null {
    return this.userImageSubject.value;
  }

}
