import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomStatus, RoomTypeForDropdown, RoomUpdate } from '../../../../interface/room.interface';
import { RoomService } from '../../../../service/room.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-room-status',
  templateUrl: './room-status.component.html',
  styleUrl: './room-status.component.css'
})
export class RoomStatusComponent {
  constructor(
    private roomService: RoomService,
    private messageService: MessageService
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

  roomStatus: RoomStatus[] = [];
  roomType: RoomTypeForDropdown[] = [];

  errorMessage: String = '';
  fieldErrors: any = {};

  display: boolean = false;
  @Input() roomDataIdFromParent: String = '';
  @Input() roomDataNameFromParent: String = '';
  @Input() roomDataRoomNumberFromParent: String = '';
  @Input() roomDataFloorFromParent: String = '';
  @Input() roomDataRoomTypeIdFromParent: Number = 0;
  @Input() roomDataDescriptionFromParent: String = '';
  @Input() roomDataPriceFromParent: String = '';
  @Input() roomDataStatusFromParent: String = '';
  @Output() callGetRoomBackAfterAddUpdate = new EventEmitter<String>();

  dataRoomSendToUpdate: RoomUpdate = {
    id: 0,
    name: '',
    roomNumber: '',
    floor: '',
    roomTypeId: 0,
    description: '',
    price: '',
    status: ''
  }

  showDialog() {
    this.display = true;
    this.dataRoomSendToUpdate.id = Number(this.roomDataIdFromParent);
    this.dataRoomSendToUpdate.name = this.roomDataNameFromParent;
    this.dataRoomSendToUpdate.roomNumber = this.roomDataRoomNumberFromParent;
    this.dataRoomSendToUpdate.floor = this.roomDataFloorFromParent;
    this.dataRoomSendToUpdate.roomTypeId = this.roomDataRoomTypeIdFromParent;
    this.dataRoomSendToUpdate.description = this.roomDataDescriptionFromParent;
    this.dataRoomSendToUpdate.price = this.roomDataPriceFromParent;
    this.dataRoomSendToUpdate.status = this.roomDataStatusFromParent;
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data: any) => {
      this.roomType = data.result;
    })
  }

  handleUpdateStatusRooom() {
    this.roomService.updateRoomStatus(this.dataRoomSendToUpdate.id, this.dataRoomSendToUpdate.status).subscribe({
      next: () => {
        console.log(this.dataRoomSendToUpdate.id, this.dataRoomSendToUpdate.status);
        this.display = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    })
  }
}