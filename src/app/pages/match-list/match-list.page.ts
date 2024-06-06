import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Observable, Subscription, of } from 'rxjs';
import { MatchService } from '../../services/match.service';
import { AuthenticationService, UserData } from '../../services/authentication.service';
import { Match } from '../../models/match.models';
import { MatchDetailsComponent } from '../../match-details/match-details.component';
import { catchError, map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.page.html',
  styleUrls: ['./match-list.page.scss'],
})
export class MatchListPage implements OnInit, OnDestroy {
  public matches$!: Observable<Match[]>;
  public allMatches: Match[] = [];
  public filteredMatches: Match[] = [];
  public selectedType: string = '';
  private matchesSubscription?: Subscription;
  currentUserId?: string;
  currentUserName?: string;

  constructor(
    private matchService: MatchService,
    public modalController: ModalController,
    private authService: AuthenticationService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.currentUserName = `${user.nombre} ${user.apellidos}`;
      }
    });

    this.matches$ = this.matchService.getAllMatches().pipe(
      catchError(err => {
        console.error(err);
        return of([]);
      }),
      map(matches => {
        return matches.map(match => {
          if (match.time instanceof firebase.firestore.Timestamp) {
            match.time = match.time.toDate();
          }
          return match;
        });
      })
    );
    this.matchesSubscription = this.matches$.subscribe(matches => {
      this.allMatches = matches;
      this.applyFilter();
    });
  }

  ngOnDestroy() {
    if (this.matchesSubscription) {
      this.matchesSubscription.unsubscribe();
    }
  }

  async openMatchDetails(match: Match) {
    if (match.isPrivate) {
      const alert = await this.alertController.create({
        header: 'Partido Privado',
        message: 'Por favor, ingrese la contraseña para acceder a los detalles del partido.',
        inputs: [
          {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Entrar',
            handler: async (data) => {
              const isValidPassword = await this.matchService.checkMatchPassword(match.id, data.password);
              if (isValidPassword) {
                this.presentMatchDetailsModal(match);
              } else {
                const errorAlert = await this.alertController.create({
                  header: 'Contraseña Incorrecta',
                  message: 'La contraseña ingresada es incorrecta. Inténtelo de nuevo.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.presentMatchDetailsModal(match);
    }
  }

  async presentMatchDetailsModal(match: Match) {
    const modal = await this.modalController.create({
      component: MatchDetailsComponent,
      componentProps: { match }
    });

    modal.onDidDismiss().then(() => {
      // Recargar la lista de partidos después de cerrar el modal
      this.matches$ = this.matchService.getAllMatches().pipe(
        catchError(err => {
          console.error(err);
          return of([]);
        }),
        map(matches => {
          return matches.map(match => {
            if (match.time instanceof firebase.firestore.Timestamp) {
              match.time = match.time.toDate();
            }
            return match;
          });
        })
      );
      this.matchesSubscription = this.matches$.subscribe(matches => {
        this.allMatches = matches;
        this.applyFilter();
      });
    });

    return await modal.present();
  }

  onJoinMatch(matchId: string): void {
    if (this.currentUserId) {
      this.matchService.joinMatch(matchId, this.currentUserId).then(() => {
        console.log(`${this.currentUserName} se ha unido al partido ${matchId}`);
      }).catch(error => {
        console.error('Error al unirse al partido:', error);
      });
    } else {
      console.error('Usuario no autenticado');
    }
  }

  onTypeChange() {
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedType) {
      this.filteredMatches = this.allMatches.filter(match => match.type === this.selectedType);
    } else {
      this.filteredMatches = [...this.allMatches];
    }
  }
}
