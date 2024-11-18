import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url: string = 'http://localhost:3000/login';
  private tokenKey = 'auth_token';

  private refresh_url: string = 'http://localhost:3000/refresh-token';
  private RefreshTokenKey = 'refresh_token';

  constructor(private HttpClient: HttpClient, private router: Router) { }

  login(identifier: string, password: string): Observable<any> {
    return this.HttpClient.post<any>(this.login_url, { identifier, password }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.RefreshTokenKey, token);
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.RefreshTokenKey);
    } else {
      return null;
    }
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

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.RefreshTokenKey);
    this.router.navigate(['/login']);
  }

}
