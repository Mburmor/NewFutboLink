import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Match } from '../models/match.models';
import { MatchService } from '../services/match.service';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, switchMap, map, first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  @Input() match?: Match;
  players$: Observable<any[]> = of([]);
  @Output() updateMatch = new EventEmitter<void>();
  currentUserId: string = '';
  isCreator: boolean = false;

  constructor(
    private matchService: MatchService,
    private authService: AuthenticationService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    if (this.match?.id) {
      this.players$ = this.matchService.getPlayersInMatch(this.match.id).pipe(
        catchError(err => {
          console.error('Error al obtener jugadores', err);
          return of([]);
        }),
        switchMap(playerIds => {
          const allPlayerIds = [...playerIds, ...(this.match?.invitedPlayers || [])];
          if (allPlayerIds.length === 0) {
            return of([]);
          }
          const playerObservables = allPlayerIds.map((playerId: string) => {
            if (playerId.startsWith('Invitado: ')) {
              return of({ nombre: playerId.replace('Invitado: ', ''), id: playerId, photoURL: 'assets/default-avatar.png' });
            } else {
              return this.matchService.getPlayerById(playerId).pipe(
                catchError(err => {
                  console.error('Error al obtener datos del jugador', err);
                  return of(null);
                }),
                map(player => player ? { ...player, id: playerId } : null)
              );
            }
          });
          return combineLatest(playerObservables).pipe(
            map(players => players.filter(player => player !== null))
          );
        })
      );
    }

    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.isCreator = this.currentUserId === this.match?.createdBy || user.email === 'admin@FL.com';
      }
    });
  }

  async joinMatch() {
    if (this.match?.id) {
      this.authService.currentUser.subscribe(async currentUser => {
        const userId = currentUser?.uid;
        const players = await this.players$.pipe(first()).toPromise();
        const playersCount = players ? players.length : 0;

        if (userId && this.match?.id) {
          if (playersCount >= (this.match.maxPlayers || 0)) {
            this.showAlert('Lo siento, el partido está completo');
            return;
          }

          this.matchService.joinMatch(this.match.id, userId)
            .then(() => {
              this.updateMatch.emit();
              this.ngOnInit();  // Refresh player list
            })
            .catch(error => {
              console.error('Error al unirse al partido:', error);
            });
        } else {
          console.error('Usuario no autenticado o partido no definido');
        }
      });
    } else {
      console.error('Partido no definido');
    }
  }

  leaveMatch() {
    if (this.match?.id) {
      this.authService.currentUser.subscribe(currentUser => {
        const userId = currentUser?.uid;

        if (userId && this.match?.id) {
          this.matchService.leaveMatch(this.match.id, userId)
            .then(() => {
              this.updateMatch.emit();
              this.ngOnInit();  // Refresh player list
            })
            .catch(error => {
              console.error('Error al borrarse del partido:', error);
            });
        } else {
          console.error('Usuario no autenticado o partido no definido');
        }
      });
    } else {
      console.error('Partido no definido');
    }
  }

  async removePlayer(playerId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar a este jugador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.match?.id && this.isCreator) {
              this.matchService.removePlayerFromMatch(this.match.id, playerId)
                .then(() => {
                  this.updateMatch.emit();
                  this.ngOnInit();  // Refresh player list
                })
                .catch(error => {
                  console.error('Error al eliminar al jugador:', error);
                });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
