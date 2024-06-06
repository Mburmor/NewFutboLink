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

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthenticationService // Añadir el servicio de autenticación
  ) {}

  async onRegister() {
    if (!this.user.email || !this.user.password || !this.user.nombre || !this.user.apellidos || this.user.edad == null) {
      console.error('Todos los campos son necesarios');
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
    } catch (error) {
      console.error('Error en el registro', error);
    }
  }

  async onGoogleRegister() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Error en el registro con Google', error);
    }
  }
}
