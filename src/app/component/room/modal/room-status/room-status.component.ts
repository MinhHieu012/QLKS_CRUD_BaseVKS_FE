import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomStatus, RoomTypeForDropdown, RoomUpdate } from '../../../../interface/room.interface';
import { RoomService } from '../../../../service/room.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../../../service/local-storage-service.service';
import { CommonComponent } from '../../../../utils/common.component';

@Component({
  selector: 'app-room-status',
  templateUrl: './room-status.component.html',
  styleUrl: './room-status.component.css'
})
export class RoomStatusComponent {
  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private commmonFunc: CommonComponent,
  ) { }

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
    this.roomStatus = [
      { name: 'ACTIVE', code: 'Đang rảnh' },
      { name: 'LOCK', code: 'Bị khóa' },
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
    if (this.roomDataStatusFromParent === 'USING' || this.roomDataStatusFromParent === 'APPROVED') {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Phòng đang sử dụng hoặc đã được đặt lịch! Không thể cập nhật!" });
    } else {
      this.dataRoomSendToUpdate.id = Number(this.roomDataIdFromParent);
      this.dataRoomSendToUpdate.name = this.roomDataNameFromParent;
      this.dataRoomSendToUpdate.roomNumber = this.roomDataRoomNumberFromParent;
      this.dataRoomSendToUpdate.floor = this.roomDataFloorFromParent;
      this.dataRoomSendToUpdate.roomTypeId = this.roomDataRoomTypeIdFromParent;
      this.dataRoomSendToUpdate.description = this.roomDataDescriptionFromParent;
      this.dataRoomSendToUpdate.price = this.roomDataPriceFromParent;
      this.dataRoomSendToUpdate.status = this.roomDataStatusFromParent;
      this.display = true;
    }
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data: any) => {
      this.roomType = data.result;
    })
  }

  handleUpdateStatusRooom() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.roomService.updateRoomStatus(this.dataRoomSendToUpdate.id, this.dataRoomSendToUpdate.status).subscribe({
        next: () => {
          this.display = false;
          this.callGetRoomBackAfterAddUpdate.emit();
          this.showUpdateSuccessNotification();
          this.clearModalDataUpdateRoom();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.fieldErrors = error.error.result;
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      })
    }
  }

  clearModalDataUpdateRoom() {
    this.dataRoomSendToUpdate = {
      id: 0,
      name: '',
      roomNumber: '',
      floor: '',
      roomTypeId: 0,
      description: '',
      price: '',
      status: ''
    }
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showUpdateSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật phòng thành công!' });
  }

  showUpdateFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật phòng thất bại!' });
  }
}