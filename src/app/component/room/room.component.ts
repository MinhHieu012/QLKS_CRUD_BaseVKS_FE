import { Component } from '@angular/core';
import { Room, RoomStatus, RoomTypeForDropdown } from '../../interface/room.interface';
import { RoomService } from '../../service/room.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {

  constructor(
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
    this.roomStatus = [
      { name: 'ACTIVE' },
      { name: 'LOCK' },
      { name: 'CLEANING' },
      { name: 'USING' },
      { name: 'APPROVED' }
    ];
  }

  roomStatus: RoomStatus[] = [];
  roomType: RoomTypeForDropdown[] = [];

  listRoom: Room[] = [];

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data:any) => {
      this.roomType = data.result;
      this.getAllRoom();
    })
  }

  getAllRoom() {
    this.roomService.getAllRoom().subscribe((data:any) => {
      this.listRoom = data.result;
    })
  }
}
