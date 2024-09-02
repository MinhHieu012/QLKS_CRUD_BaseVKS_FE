import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { GetRoomTypeWithSearchPaging, RoomType, RoomTypeAddUpdate } from '../interface/roomtype.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('')
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  public getRoomTypeWithSearchAndPaging(data: GetRoomTypeWithSearchPaging): Observable<RoomType> {
    let params = new HttpParams()
      .set('page', data.page ? data.page : '')
      .set('limit', '5')
      .set('name', data.name ? data.name : '')
      .set('maxPeople', data.maxPeople ? data.maxPeople : '')
    return this.http.get<RoomType>('http://localhost:8080/admin/quanlykieuphong/filter', { params })
  }

  public addRoomType(dataAddRoomType: RoomTypeAddUpdate) {
    const headers = this.localStorageService.header();
    return this.http.post<RoomType>('http://localhost:8080/admin/quanlykieuphong/add', dataAddRoomType, {headers});
  }

  public updateRoomType(roomTypeDataSendToUpdate: RoomTypeAddUpdate) {
    const headers = this.localStorageService.header();
    return this.http.put<RoomType>(`http://localhost:8080/admin/quanlykieuphong/update/${roomTypeDataSendToUpdate.id}`, roomTypeDataSendToUpdate, {headers});
  }

  public deleteRoomType(id: Number) {
    const headers = this.localStorageService.header();
    return this.http.delete<RoomType>(`http://localhost:8080/admin/quanlykieuphong/delete/${id}`, {headers});
  }
}
