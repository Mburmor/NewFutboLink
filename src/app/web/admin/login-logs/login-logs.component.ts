import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-login-logs',
  templateUrl: './login-logs.component.html',
  styleUrls: ['./login-logs.component.scss']
})
export class LoginLogComponent implements OnInit {
  loginLogs: any[] = [];

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLoginLogs().subscribe(logs => {
      this.loginLogs = logs;
    });
  }
}
