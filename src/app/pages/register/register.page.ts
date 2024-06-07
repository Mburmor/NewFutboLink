import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    edad: null
  };
  errorMessage = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthenticationService // Añadir el servicio de autenticación
  ) {}

  async onRegister() {
    this.errorMessage = '';
    if (!this.user.email || !this.user.password || !this.user.nombre || !this.user.apellidos || this.user.edad == null) {
      this.errorMessage = 'Todos los campos son necesarios';
      return;
    }
    
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      console.log('Registro exitoso', result);

      const newUser = {
        email: this.user.email,
        nombre: this.user.nombre,
        apellidos: this.user.apellidos,
        edad: this.user.edad,
        uid: result.user?.uid
      };
      await this.firestore.collection('users').doc(result.user?.uid).set(newUser);
      
      console.log('Usuario añadido a Firestore');

      this.router.navigate(['/login']);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'El correo electrónico ya está en uso.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage = 'Operación no permitida. Contacta al administrador.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es demasiado débil.';
          break;
        default:
          this.errorMessage = 'Error en el registro. Intente nuevamente.';
          console.error('Error en el registro', error);
      }
    }
  }

  async onGoogleRegister() {
    this.errorMessage = ''; // Limpiar mensaje de error anterior
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      this.errorMessage = 'Error en el registro con Google. Intente nuevamente.';
      console.error('Error en el registro con Google', error);
    }
  }
}
