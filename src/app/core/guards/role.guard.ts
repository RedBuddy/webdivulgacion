import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['expectedRoles'];
  const userRole = authService.getUserRole();

  if (userRole === null || !expectedRoles.includes(userRole)) {
    // Redirigir al usuario a una página de acceso denegado o a la página de inicio
    router.navigate(['/access-denied']);
    return false;
  }
  return true;
};
