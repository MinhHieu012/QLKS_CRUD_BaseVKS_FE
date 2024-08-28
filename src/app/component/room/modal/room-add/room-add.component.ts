import { Component } from '@angular/core';
import { RoomTypeForDropdown } from '../../../../interface/room.interface';
import { RoomService } from '../../../../service/room.service';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.css'
})
export class RoomAddComponent {
  constructor(
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
  }

  display: boolean = false;

  roomType: RoomTypeForDropdown[] = [];

  showDialog() {
    this.display = true;
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data:any) => {
      this.roomType = data.result;
    })
  }

  handleAddRoom() {}
}
