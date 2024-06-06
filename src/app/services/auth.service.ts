import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {
    // Verificar el estado de autenticación al iniciar la aplicación
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.setUser(user);
      }
    });
  }

  private setUser(user: firebase.User | null) {
    if (!user) return;
    // Aquí puedes establecer el usuario en algún estado global o realizar otras acciones necesarias
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user ? user.uid : 'anonymous';
  }

  getCurrentUserName(): string {
    const user = this.getCurrentUser();
    return user ? user.displayName || 'Guest' : 'Guest';
  }
}
