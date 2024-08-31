import { Injectable } from '@angular/core';
import { Room, RoomAdd, RoomTypeForDropdown, RoomUpdate } from '../interface/room.interface';
import { LocalStorageService } from './local-storage-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  public getAllRoomTypeForDropdown() {
    return this.http.get<RoomTypeForDropdown>('http://localhost:8080/admin/quanlykieuphong');
  }

  public getAllRoom() {
    return this.http.get<Room>('http://localhost:8080/admin/quanlyphong');
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
