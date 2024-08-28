import { Injectable } from '@angular/core';
import { Room, RoomTypeForDropdown } from '../interface/room.interface';
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
}
