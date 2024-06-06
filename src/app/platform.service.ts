import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  isMobile(): boolean {
    return /Android/i.test(navigator.userAgent);
  }
}
