import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatchService } from '../../../services/match.service';
import { AlertController } from '@ionic/angular';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  users: any[] = [];
  loginLogs: any[] = [];

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private alertController: AlertController,
    private logService: LogService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.logService.getLoginLogs().subscribe(logs => {
      this.loginLogs = logs;
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        };
      });
    });
  }

  async deleteUser(userId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.userService.deleteUser(userId);
              this.users = this.users.filter(user => user.id !== userId);
            } catch (error) {
              console.error('Error al eliminar el usuario:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAllMatches() {
    if (confirm('¿Estás seguro de que deseas eliminar todos los partidos? Esta acción no se puede deshacer.')) {
      this.matchService.deleteAllMatches().then(() => {
        alert('Todos los partidos han sido eliminados.');
      }).catch(error => {
        console.error('Error al eliminar los partidos: ', error);
        alert('Hubo un problema al eliminar los partidos.');
      });
    }
  }
}
