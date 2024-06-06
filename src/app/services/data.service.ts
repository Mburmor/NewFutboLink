import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  // Añadir un nuevo partido
  addPartido(partido: any) {
    return this.afs.collection('partidos').add(partido);
  }

  // Añadir un nuevo usuario
  addUser(user: any) {
    return this.afs.collection('usuarios').add(user);
  }

  // Obtener partidos
  getPartidos() {
    return this.afs.collection('partidos').valueChanges();
  }

  // Obtener usuarios
  getUsers() {
    return this.afs.collection('usuarios').valueChanges();
  }
}
