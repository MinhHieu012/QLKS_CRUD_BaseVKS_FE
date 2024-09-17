import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { GetRoomTypeWithSearchPaging, RoomType, RoomTypeAddUpdate } from '../interface/roomtype.interface';
import { Observable } from 'rxjs';
import { EnviromentComponent } from '../utils/enviroment.component';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('')
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private env: EnviromentComponent
  ) { }

  public getRoomTypeWithSearchAndPaging(data: GetRoomTypeWithSearchPaging): Observable<RoomType> {
    let params = new HttpParams()
      .set('page', data.page ? data.page : '')
      .set('limit', '5')
      .set('name', data.name ? data.name : '')
      .set('maxPeople', data.maxPeople ? data.maxPeople : '')
    const headers = this.localStorageService.header();
    return this.http.get<RoomType>(`${this.env.local}/admin/quanlykieuphong/filter`, { params, headers })
  }

  public addRoomType(dataAddRoomType: RoomTypeAddUpdate) {
    const headers = this.localStorageService.header();
    return this.http.post<RoomType>(`${this.env.local}/admin/quanlykieuphong/add`, dataAddRoomType, { headers });
  }

  public updateRoomType(roomTypeDataSendToUpdate: RoomTypeAddUpdate) {
    const headers = this.localStorageService.header();
    return this.http.put<RoomType>(`${this.env.local}/admin/quanlykieuphong/update/${roomTypeDataSendToUpdate.id}`, roomTypeDataSendToUpdate, { headers });
  }

  public deleteRoomType(id: Number) {
    const headers = this.localStorageService.header();
    return this.http.delete<RoomType>(`${this.env.local}/admin/quanlykieuphong/delete/${id}`, { headers });
  }
}
