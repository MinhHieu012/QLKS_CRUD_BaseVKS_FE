import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetUserWithSearchPaging, User, UserAdd, UserUpdate } from '../interface/user.interface';
import { LocalStorageService } from './local-storage-service.service';
import { EnviromentComponent } from '../utils/enviroment.component';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('')
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private env: EnviromentComponent
  ) { }

  public getAllUsers(data: GetUserWithSearchPaging): Observable<User> {
    let params = new HttpParams()
    .set('page', data.page ? data.page : '')
    .set('limit', '4')
    .set('username', data.username ? data.username : '')
    .set('phone', data.phone ? data.phone : '')
    .set('identificationNumber', data.identificationNumber ? data.identificationNumber : '')
    const headers = this.localStorageService.header();
    return this.http.get<User>(`${this.env.local}/admin/quanlyuser/filter`, { params, headers });
  }

  public addUser(dataAddUser: UserAdd) {
    const headers = this.localStorageService.header();
    return this.http.post<User>('${this.env.local}/admin/quanlyuser/add', dataAddUser, {headers});
  }

  public updateUser(dataUserSendToUpdate: UserUpdate) {
    const headers = this.localStorageService.header();
    return this.http.put<User>(`${this.env.local}/admin/quanlyuser/update/${dataUserSendToUpdate.id}`, dataUserSendToUpdate, {headers});
  }

  public lockUser(id: String) {
    const headers = this.localStorageService.header();
    return this.http.patch<User>(`${this.env.local}/admin/quanlyuser/lock/${id}`, {}, {headers});
  }

  public unLockUser(id: String) {
    const headers = this.localStorageService.header();
    return this.http.patch<User>(`${this.env.local}/admin/quanlyuser/unlock/${id}`, {}, {headers});
  }
}