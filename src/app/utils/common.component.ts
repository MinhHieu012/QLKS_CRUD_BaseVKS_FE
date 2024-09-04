import { Injectable } from '@angular/core';
import { LocalStorageService } from '../service/local-storage-service.service';

@Injectable({
     providedIn: 'root'
})

export class CommonComponent {
     constructor(
          private localStorageService: LocalStorageService
     ) { }
     checkUserRoleOrLoggedIn() {
          const accessToken = this.localStorageService.getAccessToken();
          return accessToken;
     }
}