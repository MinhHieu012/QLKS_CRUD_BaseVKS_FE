import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IToken } from "../interface/login.interface";

@Injectable({ providedIn: 'root' })

export class LocalStorageService {
  getToken(): IToken {
    const jwtObject = localStorage.getItem('token');
    return jwtObject ? JSON.parse(jwtObject) : null;
  }

  header(): HttpHeaders {
    const jwtString = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtString.accessToken}`
    });
    return headers
  }

  getAccessToken() {
    const jwtString = this.getToken();
    return jwtString ? jwtString.accessToken : null;
  }
}
