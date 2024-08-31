import { Component } from '@angular/core';
import { GetRoomWithSearchPaging, Room, RoomStatus, RoomTypeForDropdown } from '../../interface/room.interface';
import { RoomService } from '../../service/room.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {

  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  isLoading: boolean = true;
  errorMessage: String = '';
  fieldErrors: any = {};

  roomStatus: RoomStatus[] = [];
  roomType: RoomTypeForDropdown[] = [];

  listRoom: Room[] = [];

  totalItem: number = 0;
  totalPage: number = 0;
  page: number = 1;
  limit: number = 3;
  stateGetRoomWithSearchPaging: GetRoomWithSearchPaging = {
    page: 1,
    limit: 3,
    name: '',
    roomNumber: '',
    floor: '',
    roomTypeId: '',
    status: ''
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data: any) => {
      this.roomType = data.result;
      this.getUserWithSearchAndPaging();
    })
  }

  getUserWithSearchAndPaging() {
    this.isLoading = true;
    this.roomService.getRoomWithSearchAndPaging(this.stateGetRoomWithSearchPaging).subscribe((data: any) => {
      this.listRoom = data.result.content;
      this.totalItem = data.result.totalElements;
      this.totalPage = data.result.totalPages;
      this.isLoading = false;
    })
  }

  getAllRoomAgain() {
    this.getUserWithSearchAndPaging();
  }

  onPageChange(event: any) {
    this.stateGetRoomWithSearchPaging.page = event.page + 1;
    this.getUserWithSearchAndPaging();
  }
}
