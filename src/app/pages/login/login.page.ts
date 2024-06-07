import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthenticationService) { }

  async onLogin() {
    this.errorMessage = '';
    try {
      await this.authService.login(this.user.email, this.user.password);
      console.log('Inicio de sesión exitoso');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/wrong-password':
          this.errorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'No se encontró un usuario con este correo electrónico.';
          break;
        default:
          this.errorMessage = 'Email o contraseña incorrecta, intente nuevamente.';
          console.error('Error en el inicio de sesión', error);
      }
    }
  }

  async onLoginWithGoogle() {
    this.errorMessage = ''; // Limpiar mensaje de error anterior
    try {
      await this.authService.loginWithGoogle();
      console.log('Inicio de sesión con Google exitoso');
    } catch (error) {
      this.errorMessage = 'Error en el inicio de sesión con Google. Intente nuevamente.';
      console.error('Error en el inicio de sesión con Google', error);
    }
  }
}
