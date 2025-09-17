import { Injectable } from '@angular/core';
import { Token } from 'src/shared/interfaces/token.interface';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  decodeToken(token: string): Token | null {
    if (!token) return null;

    try {
      return jwtDecode<Token>(token, {});
    } catch (e) {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    const expiry = payload.exp * 1000; // convertir a ms
    return Date.now() > expiry;
  }

  getUsername(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  getRefreshVersion(token: string): number | null {
    const payload = this.decodeToken(token);
    return payload?.rv || null;
  }
}
