import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service'; // Importar el servicio de autenticación
import { Match } from '../../models/match.models';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.page.html',
  styleUrls: ['./create-match.page.scss'],
})
export class CreateMatchPage {
  errorMessage: string = '';

  newMatch: Match = {
    id: this.generateUniqueId(),
    location: '',
    time: new Date(),
    type: '5v5',
    players: [],
    maxPlayers: 0, // Inicializamos en 0
    createdBy: '', // Inicializamos como cadena vacía
    creatorName: '', // Inicializamos como cadena vacía
    invitedPlayers: [],
    isPrivate: false, // Inicializamos como no privado
    password: '' // Inicializamos sin contraseña
  };

  constructor(
    private matchService: MatchService,
    private authService: AuthenticationService, // Servicio de autenticación
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.newMatch.createdBy = user.uid;
        this.newMatch.creatorName = user.nombre;
      }
    });
  }

  onCreateMatch() {
    if (!this.newMatch.location || !this.newMatch.time || !this.newMatch.type) {
      this.errorMessage = 'Por favor, rellena todos los campos antes de crear el partido.';
      return;
    }

    if (typeof this.newMatch.time === 'string') {
      this.newMatch.time = new Date(this.newMatch.time);
    }

    this.newMatch.maxPlayers = this.getMaxPlayers(this.newMatch.type);

    this.matchService.createMatch(this.newMatch).then(() => {
      this.errorMessage = '';
      this.router.navigateByUrl('/match-list');
    }).catch(error => {
      this.errorMessage = 'Hubo un problema al crear el partido. Inténtalo de nuevo.';
      console.error('Error al crear el partido', error);
    });
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getMaxPlayers(type: '5v5' | '7v7' | '11v11'): number {
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
  
  updateMaxPlayers() {
    this.newMatch.maxPlayers = this.getMaxPlayers(this.newMatch.type);
  }
}
