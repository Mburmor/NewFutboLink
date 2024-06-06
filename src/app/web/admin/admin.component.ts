// src/app/web/admin/admin.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AdminAuthService, private router: Router) {}

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/admin/tools']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
