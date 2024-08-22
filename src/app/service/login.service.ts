import { LocalStorageService } from './local-storage-service.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount, IToken, IUser } from '../interface/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http:HttpClient,
    private localStorageService:LocalStorageService
  ) { }

  register(account:IAccount):Observable<IToken>{
    return this.http.post<IToken>("http://localhost:8080/api/v1/auth/register", account);
  }

  createUser(user:IUser):Observable<any>{
    const headers = this.localStorageService.header();
    return this.http.post<any>("http://localhost:8080/api/v1/private/users/create", user, {headers});
  }
}
