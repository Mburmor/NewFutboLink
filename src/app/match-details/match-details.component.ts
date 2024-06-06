import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Match } from '../models/match.models';
import { MatchService } from '../services/match.service';
import { AuthenticationService, UserData } from '../services/authentication.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit {
  @Input() match?: Match;
  @Output() playerJoined: EventEmitter<void> = new EventEmitter<void>();
  currentUserId: string = '';
  isCreator: boolean = false;
  invitedPlayerName: string = '';

  constructor(
    public modalController: ModalController,
    private matchService: MatchService,
    private authService: AuthenticationService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.match && this.match.time instanceof firebase.firestore.Timestamp) {
      this.match.time = this.match.time.toDate();
    }

    this.authService.currentUser.subscribe((user: UserData | null) => {
      if (user) {
        this.currentUserId = user.uid;
        this.isCreator = this.currentUserId === this.match?.createdBy || user.email === 'admin@FL.com';
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  async deleteMatch() {
    if (!this.isCreator) {
      const alert = await this.alertController.create({
        header: 'Acción no permitida',
        message: 'No tienes permiso para eliminar este partido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este partido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.match) {
              this.matchService.deleteMatch(this.match.id, this.currentUserId)
                .then(() => {
                  this.modalController.dismiss(); // Cerrar el modal después de la eliminación
                })
                .catch(error => {
                  console.error('Error al eliminar el partido:', error);
                });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async invitePlayer() {
    if (!this.isCreator) {
      const alert = await this.alertController.create({
        header: 'Acción no permitida',
        message: 'No tienes permiso para invitar jugadores.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.match?.id && this.invitedPlayerName.trim()) {
      try {
        await this.matchService.invitePlayer(this.match.id, this.invitedPlayerName.trim());
        this.invitedPlayerName = '';
        this.handlePlayerJoined(); // Refresca la lista de jugadores después de invitar a un jugador
      } catch (error) {
        console.error('Error al invitar al jugador:', error);
      }
    }
  }

  handlePlayerJoined() {
    // Lógica para manejar cuando un jugador se une
  }

  handlePlayerRemoved() {
    this.handlePlayerJoined(); // Refresca la lista de jugadores después de eliminar a un jugador
  }

  async removePlayer(playerId: string) {
    if (!this.isCreator) {
      const alert = await this.alertController.create({
        header: 'Acción no permitida',
        message: 'No tienes permiso para eliminar jugadores.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.match?.id) {
      try {
        await this.matchService.removePlayerFromMatch(this.match.id, playerId);
        this.handlePlayerJoined(); // Refresca la lista de jugadores después de eliminar a un jugador
      } catch (error) {
        console.error('Error al eliminar al jugador:', error);
      }
    }
  }
}
