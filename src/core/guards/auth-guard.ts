import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1), // solo toma el último valor actual
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // usuario autenticado, deja pasar
      } else {
        router.navigate(['/login']); // redirige al login
        return false;
      }
    })
  );
};
