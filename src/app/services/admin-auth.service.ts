import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private adminUser = { username: 'admin@FL.com', password: 'adminFL' }; // Credenciales correctas

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.adminUser.username && password === this.adminUser.password) {
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }
}
