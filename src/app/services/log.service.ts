import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private firestore: AngularFirestore) {}

  getLoginLogs(): Observable<any[]> {
    return this.firestore.collection('loginLogs', ref => ref.orderBy('timestamp', 'desc')).valueChanges();
  }
}
