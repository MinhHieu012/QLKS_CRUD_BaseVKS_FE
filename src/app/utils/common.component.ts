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
          this.checkUserRoleUsingJwt();
          return accessToken;
     }

     checkUserRoleUsingJwt() {
          const accessToken = this.localStorageService.getAccessToken();
          if (accessToken) {
               const jwtData = accessToken.split('.')[1];
               const decodedJwtJsonData = window.atob(jwtData);
               const decodedJwtData = JSON.parse(decodedJwtJsonData);
               return decodedJwtData.sub;
          } else {
               return null;
          }
     }
}