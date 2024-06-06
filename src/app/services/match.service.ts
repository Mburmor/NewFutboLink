import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Match } from '../models/match.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor(private afs: AngularFirestore, private alertController: AlertController) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  getAllMatches(): Observable<Match[]> {
    return this.afs.collection<Match>('matches').valueChanges({ idField: 'id' });
  }

  createMatch(match: Match): Promise<void> {
    match.maxPlayers = this.getMaxPlayers(match.type);
    match.invitedPlayers = match.invitedPlayers || [];
    return this.afs.collection('matches').doc(match.id).set(match);
  }

  joinMatch(matchId: string, userId: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('Partido no encontrado');

      const matchData = matchDoc.data() as Match;
      if (matchData.players.includes(userId)) throw new Error('El usuario ya está apuntado al partido');
      if (matchData.players.length >= matchData.maxPlayers) throw new Error('El partido está completo');

      matchData.players.push(userId);
      transaction.update(matchRef.ref, { players: matchData.players });
    });
  }

  leaveMatch(matchId: string, userId: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('Partido no encontrado');

      const matchData = matchDoc.data() as Match;
      matchData.players = matchData.players.filter(id => id !== userId);
      transaction.update(matchRef.ref, { players: matchData.players });
    });
  }

  getPlayersInMatch(matchId: string): Observable<string[]> {
    return this.afs.collection('matches').doc(matchId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as Match;
        return [...new Set([...data.players, ...(data.invitedPlayers || [])])] ?? [];
      })
    );
  }

  getPlayerById(playerId: string): Observable<any> {
    return this.afs.collection('users').doc(playerId).valueChanges();
  }

  invitePlayer(matchId: string, invitedName: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('Partido no encontrado');

      const matchData = matchDoc.data() as Match;
      const totalPlayers = matchData.players.length + (matchData.invitedPlayers?.length || 0);
      if (totalPlayers >= matchData.maxPlayers) throw new Error('El partido está completo');

      matchData.invitedPlayers = matchData.invitedPlayers || [];
      const invitedPlayerString = `Invitado: ${invitedName}`;
      if (matchData.invitedPlayers.includes(invitedPlayerString)) throw new Error('El jugador ya está invitado');

      matchData.invitedPlayers.push(invitedPlayerString);
      transaction.update(matchRef.ref, { invitedPlayers: matchData.invitedPlayers });
    });
  }

  checkMatchPassword(matchId: string, password: string): Promise<boolean> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return matchRef.get().toPromise().then(doc => {
      if (!doc || !doc.exists) throw new Error('Partido no encontrado');

      const matchData = doc.data() as Match;
      return matchData.password === password;
    });
  }

  private getMaxPlayers(type: '5v5' | '7v7' | '11v11'): number {
    switch (type) {
      case '5v5':
        return 10;
      case '7v7':
        return 14;
      case '11v11':
        return 22;
      default:
        return 0;
    }
  }

  deleteMatch(matchId: string, userId: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('Partido no encontrado');

      const matchData = matchDoc.data() as Match;
      if (matchData.createdBy !== userId) throw new Error('Solo el creador del partido puede eliminarlo');

      transaction.delete(matchRef.ref);
    });
  }

  removePlayerFromMatch(matchId: string, playerId: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('Partido no encontrado');

      const matchData = matchDoc.data() as Match;
      matchData.players = matchData.players.filter(id => id !== playerId);
      if (matchData.invitedPlayers) matchData.invitedPlayers = matchData.invitedPlayers.filter(name => name !== playerId);

      const updateData: any = { players: matchData.players, invitedPlayers: matchData.invitedPlayers };
      transaction.update(matchRef.ref, updateData);
    });
  }

  deleteAllMatches(): Promise<void> {
    const batch = this.afs.firestore.batch();
    return this.afs.collection('matches').ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }

}
