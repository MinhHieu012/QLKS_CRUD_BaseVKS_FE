import { Injectable } from '@angular/core';
import { GetRoomWithSearchPaging, Room, RoomAdd, RoomTypeForDropdown, RoomUpdate } from '../interface/room.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  public getAllRoomTypeForDropdown() {
    return this.http.get<RoomTypeForDropdown>('http://localhost:8080/admin/quanlykieuphong');
  }

  public getRoomWithSearchAndPaging(data: GetRoomWithSearchPaging) {
    let params = new HttpParams()
    .set('page', data.page ? data.page : '')
    .set('limit', '3')
    .set('name', data.name ? data.name : '')
    .set('roomNumber', data.roomNumber ? data.roomNumber : '')
    .set('floor', data.floor ? data.floor : '')
    .set('roomTypeId', data.roomTypeId ? data.roomTypeId : '')
    .set('status', data.status ? data.status : '');
    return this.http.get<Room>('http://localhost:8080/admin/quanlyphong/filter', {params});
  }

  public addRoom(dataAddRoom: RoomAdd) {
    const headers = this.localStorageService.header();
    return this.http.post<Room>('http://localhost:8080/admin/quanlyphong/add', dataAddRoom, {headers});
  }

  public updateRoom(dataRoomSendToUpdate: RoomUpdate) {
    const headers = this.localStorageService.header();
    return this.http.put<Room>(`http://localhost:8080/admin/quanlyphong/update/${dataRoomSendToUpdate.id}`, dataRoomSendToUpdate, {headers});
  }

  public updateRoomStatus(id: Number, status: String) {
    const headers = this.localStorageService.header();
    return this.http.put<Room>(`http://localhost:8080/admin/quanlyphong/roomstatus/${id}?status=${status}`, {}, {headers});
  }
}
