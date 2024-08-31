import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetUserWithSearchPaging, User, UserAdd, UserUpdate } from '../interface/user.interface';
import { LocalStorageService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('')
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  public getAllUsers(data: GetUserWithSearchPaging): Observable<User> {
    let params = new HttpParams()
    .set('page', data.page ? data.page : '')
    .set('limit', '4')
    .set('username', data.username ? data.username : '')
    .set('phone', data.phone ? data.phone : '')
    .set('identificationNumber', data.identificationNumber ? data.identificationNumber : '')
    return this.http.get<User>(`http://localhost:8080/admin/quanlyuser/filter`, {params});
  }

  public addUser(dataAddUser: UserAdd) {
    const headers = this.localStorageService.header();
    return this.http.post<User>('http://localhost:8080/admin/quanlyuser/add', dataAddUser, {headers});
  }

  public updateUser(dataUserSendToUpdate: UserUpdate) {
    const headers = this.localStorageService.header();
    return this.http.put<User>(`http://localhost:8080/admin/quanlyuser/update/${dataUserSendToUpdate.id}`, dataUserSendToUpdate, {headers});
  }

  public lockUser(id: String) {
    const headers = this.localStorageService.header();
    return this.http.patch<User>(`http://localhost:8080/admin/quanlyuser/lock/${id}`, {}, {headers});
  }

  public unLockUser(id: String) {
    const headers = this.localStorageService.header();
    return this.http.patch<User>(`http://localhost:8080/admin/quanlyuser/unlock/${id}`, {}, {headers});
  }
}