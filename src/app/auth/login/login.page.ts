import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Auth } from 'src/core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage implements OnInit {
  rememberMe = false;
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para fácil acceso a los controles del formulario
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const credentials = {
          username: this.email?.value,
          password: this.password?.value
        };
        this.authService.login(credentials).subscribe({
          next: async (response) => {

              this.isLoading = false;
              // Mostrar mensaje de éxito

              // Navegar a la página principal (tabs)
          },
          error: async (error) => {
            this.isLoading = false;
            console.error('Error de login:', JSON.stringify(error));

            // Manejar diferentes tipos de errores
            if (error.status === 401) {
              this.errorMessage = 'Credenciales incorrectas';
            } else if (error.status === 0) {
              this.errorMessage = 'Error de conexión. Verifica tu internet.';
            } else {
              this.errorMessage = error.error?.message || 'Error del servidor. Intenta nuevamente.';
            }

            await this.showToast(this.errorMessage, 'danger');
          }
        });

      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Error inesperado';
        await this.showToast('Error inesperado', 'danger');
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}
