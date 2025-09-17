import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor = (storage: Storage): HttpInterceptorFn => {
  return (req: HttpRequest<any>, next: HttpHandlerFn) => {
    // Convertimos la promesa de storage en Observable
    return from(storage.create()).pipe(
      switchMap(() =>
        from(storage.get('access_token')).pipe(
          switchMap((token) => {
            if (token) {
              const authReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(authReq);
            }
            return next(req);
          })
        )
      )
    );
  };
};
