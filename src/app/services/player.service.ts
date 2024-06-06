import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MatchData {
  players: string[];

}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private afs: AngularFirestore) {}

  joinMatch(matchId: string, userId: string): Promise<void> {
    const matchRef = this.afs.collection('matches').doc(matchId);
    return this.afs.firestore.runTransaction(async transaction => {
      const matchDoc = await transaction.get(matchRef.ref);
      if (!matchDoc.exists) throw new Error('El partido no existe');
      
      const matchData = matchDoc.data() as MatchData | undefined;
      if (!matchData) throw new Error('No se han encontrado datos del partido');

      const playersList = matchData.players ?? [];
      if (playersList.includes(userId)) throw new Error('El jugador ya está apuntado al partido');
      
      transaction.update(matchRef.ref, { players: [...playersList, userId] });
    });
  }

  getPlayersList(matchId: string): Observable<string[]> {
    return this.afs.collection('matches').doc(matchId).valueChanges().pipe(
      map((data): string[] => {
        const match = data as MatchData | undefined;
        return match?.players ?? [];
      })
    );
  }
}
