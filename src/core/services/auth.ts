import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { LoginResponse } from 'src/shared/interfaces/login-response.interface';
import { LoginCredentials } from 'src/shared/interfaces/login-credentials.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = environment.apiClubes;
  public storageReady = false;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private platform: Platform
  ) {
    this.init();
    this.configureApiUrl();
  }

  private configureApiUrl() {
    if (this.platform.is('hybrid')) {
      // Para emulador/dispositivo móvil - usar IP directa
      this.apiUrl = 'http://192.168.38.66:8080';
    } else {
      // Para navegador web - usar proxy (string vacío)
      this.apiUrl = '';
    }
  }

  private async init() {
    try {
      await this.storage.create();
      this.storageReady = true;
      console.log('Ionic Storage inicializado correctamente');
      await this.checkAuthStatus();
    } catch (error) {
      console.warn('Error al inicializar Ionic Storage. Usando localStorage como fallback.', error);
      this.storageReady = false;
      await this.checkAuthStatus();
    }
  }

  private async checkAuthStatus() {
    let token: string | null = null;
    let user: User | null = null;

    if (this.storageReady) {
      token = await this.storage.get('auth_token');
      user = await this.storage.get('current_user');
    } else {
      token = localStorage.getItem('auth_token');
      const u = localStorage.getItem('current_user');
      user = u ? JSON.parse(u) : null;
    }

    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    console.log('Plataforma detectada:', this.platform.platforms());
    console.log('¿Es híbrido?:', this.platform.is('hybrid'));

    if (this.platform.is('hybrid')) {
      // Usar CapacitorHttp para dispositivos móviles
      console.log('Usando CapacitorHttp para dispositivo móvil');
      return from(this.loginWithCapacitor(credentials));
    } else {
      // Usar Angular HTTP para navegador web
      console.log('Usando Angular HTTP para navegador web');
      return this.loginWithAngular(credentials);
    }
  }

async loginWithCapacitor(credentials: LoginCredentials) {
  const url = `${this.apiUrl}/api/auth/login`;

  try {
    const headers = {
        'Content-Type': 'application/json',
      }
    const response = await ((await CapacitorHttp.post({method:"POST",url,headers, data:credentials})))
    console.log('Respuesta Capacitor Http:', response);

    if (response.status >= 200 && response.status < 300) {
      await this.handleLogin(response.data);
      return response.data;
    } else {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error Capacitor Http:', error);
    throw error;
  }
}
  private loginWithAngular(credentials: LoginCredentials): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Enviando petición con Angular HTTP a: /api/auth/login');
    return this.http.post<any>('/api/auth/login', credentials, { headers }).pipe(
      tap(response => {
        console.log('Respuesta Angular HTTP:', response);
        this.handleLogin(response);
      })
    );
  }

  private async handleLogin(response: LoginResponse) {
    console.log('Procesando respuesta de login:', response);

    if (!response.token || !response.username) {
      console.error('Respuesta de login inválida:', response);
      throw new Error('Respuesta de login inválida: falta token o username');
    }

    try {
      if (this.storageReady) {
        await this.storage.set('auth_token', response.token);
        await this.storage.set('current_user', response.username);
        console.log('Datos guardados en Ionic Storage');
      } else {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('current_user', JSON.stringify(response.username));
        console.log('Datos guardados en localStorage');
      }

      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(response.username);

      console.log('Login procesado exitosamente');
    } catch (error) {
      console.error('Error al guardar datos de login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.storageReady) {
        await this.storage.remove('auth_token');
        await this.storage.remove('current_user');
        console.log('Datos eliminados de Ionic Storage');
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        console.log('Datos eliminados de localStorage');
      }
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

  async getToken(): Promise<string | null> {
    if (this.storageReady) return await this.storage.get('auth_token');
    return localStorage.getItem('auth_token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Método para probar la conectividad

}
