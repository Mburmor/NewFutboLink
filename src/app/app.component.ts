import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { filter } from 'rxjs/operators';
import { PlatformService } from './platform.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Crear Partido', url: '/create-match', icon: 'add-circle' },
    { title: 'Lista de Partidos', url: '/match-list', icon: 'list' },
    { title: 'Fotografías', url: '/fotografias', icon: 'camera' },
    { title: 'Tactibot', url: '/tactibot', icon: 'chatbubble' },
  ];

  currentUser: any;
  showMenu: boolean = true;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private platformService: PlatformService
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateMenuVisibility(event.urlAfterRedirects);
    });
  }

  ngOnInit() {
    const defaultRoute = this.platformService.isMobile() ? '/home' : '/homeweb';
    this.router.navigate([defaultRoute]);

    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        const protectedRoutes = [
          '/create-match',
          '/match-list',
          '/menu',
          '/fotografias',
          '/tactibot',
          '/profile'
        ];
        if (protectedRoutes.includes(this.router.url)) {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  updateMenuVisibility(url: string) {
    const hideMenuRoutes = ['/homeweb', '/admin', '/login', '/register'];
    this.showMenu = !hideMenuRoutes.some(route => url.includes(route));
  }
}
