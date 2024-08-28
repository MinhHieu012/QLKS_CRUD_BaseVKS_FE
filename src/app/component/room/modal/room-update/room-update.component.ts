import { Component } from '@angular/core';
import { RoomService } from '../../../../service/room.service';
import { RoomStatus, RoomTypeForDropdown } from '../../../../interface/room.interface';

@Component({
  selector: 'app-room-update',
  templateUrl: './room-update.component.html',
  styleUrl: './room-update.component.css'
})
export class RoomUpdateComponent {
  constructor(
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
    this.roomStatus = [
      { name: 'ACTIVE', code: 'Đang rảnh' },
      { name: 'LOCK',  code: 'Bị khóa' },
      { name: 'CLEANING', code: 'Đang dọn dẹp' },
      { name: 'USING', code: 'Đang sử dụng' }
    ];
  }

  display: boolean = false;

  roomStatus: RoomStatus[] = [];
  roomType: RoomTypeForDropdown[] = [];

  showDialog() {
    this.display = true;
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data: any) => {
      this.roomType = data.result;
    })
  }

  handleUpdateRoom() { }
}
