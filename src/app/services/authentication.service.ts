import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

export interface UserData {
  email: string;
  nombre: string;
  apellidos: string;
  edad: string;
  uid: string;
  photoURL: string;
  isAdmin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser = this.userSubject.asObservable();
  private defaultAvatarUrl = 'assets/default-avatar.png'; // Ruta a la imagen predeterminada

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.setUser(user);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  private async setUser(user: firebase.User | null) {
    if (!user) return;
    const userDoc = await this.firestore.collection('users').doc(user.uid).ref.get();
    const userData = userDoc.data() as UserData | undefined;
    if (userData) {
      if (!userData.photoURL) {
        userData.photoURL = this.defaultAvatarUrl;
      }
      // Comprobar si el usuario es admin
      if (user.email === 'admin@FL.com') {
        userData.isAdmin = true;
      }
      this.userSubject.next(userData);
    }
  }

  private async logSignIn(user: firebase.User) {
    const userDoc = await this.firestore.collection('users').doc(user.uid).ref.get();
    const userData = userDoc.data() as UserData | undefined;

    if (userData) {
      await this.firestore.collection('loginLogs').add({
        userId: user.uid,
        email: user.email,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  getUserById(userId: string): Observable<UserData | undefined> {
    return this.firestore.collection<UserData>('users').doc(userId).valueChanges();
  }

  async loginWithGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      const user = result.user;

      if (user) {
        const newUser: UserData = {
          email: user.email!,
          nombre: user.displayName?.split(' ')[0] || '',
          apellidos: user.displayName?.split(' ').slice(1).join(' ') || '',
          edad: '',
          uid: user.uid,
          photoURL: this.defaultAvatarUrl
        };

        await this.firestore.collection('users').doc(user.uid).set(newUser, { merge: true });
        this.setUser(user); // Actualiza el BehaviorSubject con el usuario actual
        await this.logSignIn(user); // Registrar el log de inicio de sesión
        this.router.navigate(['/menu']);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión con Google', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.setUser(result.user!); // Actualiza el BehaviorSubject con el usuario actual
      await this.logSignIn(result.user!); // Registrar el log de inicio de sesión
      this.router.navigate(['/menu']);
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.userSubject.next(null); // Resetea el BehaviorSubject
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en el cierre de sesión', error);
    }
  }

  async updateProfile(name: string, photoURL: string) {
    const user = await this.afAuth.currentUser;
    if (!user) return;

    const userRef = this.firestore.collection('users').doc(user.uid);
    await userRef.update({
      nombre: name,
      photoURL: photoURL || this.defaultAvatarUrl
    });
    this.setUser(user);
  }
}
