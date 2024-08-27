import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserAdd, UserUpdate } from '../interface/user.interface';
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

  public getAllUsers(): Observable<User> {
    return this.http.get<User>("http://localhost:8080/admin/quanlyuser");
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