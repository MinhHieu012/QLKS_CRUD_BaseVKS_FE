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

  name?: string | number | boolean;
  roomNumber?: string | number | boolean;
  floor?: string | number | boolean;
  roomTypeId?: string | number | boolean;
  status?: string | number | boolean;
  isFirstTimeSearch: boolean = true;

  totalItem: number = 0;
  totalPage: number = 0;
  page: number = 1;
  limit: number = 3;
  currentPage: number = 1;

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
      this.getRoomWithSearchAndPaging();
    })
  }

  getRoomWithSearchAndPaging() {
    this.isLoading = true;
    this.roomService.getRoomWithSearchAndPaging(this.stateGetRoomWithSearchPaging).subscribe((data: any) => {
      if (data.result.content.length === 0 && this.stateGetRoomWithSearchPaging.name !== '' || this.stateGetRoomWithSearchPaging.roomNumber !== '' || this.stateGetRoomWithSearchPaging.floor !== '' || this.stateGetRoomWithSearchPaging.roomTypeId !== '' || this.stateGetRoomWithSearchPaging.status !== '') {
        this.messageService.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy phòng nào!' });
        this.isLoading = false;
      }
      if (this.isFirstTimeSearch === true && data.result.content.length > 0 && this.stateGetRoomWithSearchPaging.name !== '' || this.stateGetRoomWithSearchPaging.roomNumber !== '' || this.stateGetRoomWithSearchPaging.floor !== '' || this.stateGetRoomWithSearchPaging.roomTypeId !== '' || this.stateGetRoomWithSearchPaging.status !== '') {
        this.messageService.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Đã tìm thấy phòng!' });
        this.isLoading = false;
      }
      this.listRoom = data.result.content;
      this.totalItem = data.result.totalElements;
      this.totalPage = data.result.totalPages;
      this.page = this.stateGetRoomWithSearchPaging.page
      this.isLoading = false;
    })
  }

  getAllRoomAgain() {
    this.stateGetRoomWithSearchPaging.page = this.currentPage;
    this.getRoomWithSearchAndPaging();
  }

  onPageChange(event: any) {
    this.stateGetRoomWithSearchPaging.page = event.page + 1;
    this.isFirstTimeSearch = false;
    this.getRoomWithSearchAndPaging();
  }

  handleSearch() {
    this.stateGetRoomWithSearchPaging.name = this.name || '';
    this.stateGetRoomWithSearchPaging.roomNumber = this.roomNumber || '';
    this.stateGetRoomWithSearchPaging.floor = this.floor || '';
    this.stateGetRoomWithSearchPaging.roomTypeId = this.roomTypeId || '';
    this.stateGetRoomWithSearchPaging.status = this.status || '';
    this.isFirstTimeSearch = true;
    this.getRoomWithSearchAndPaging();
  }

  handleResetFilter() {
    this.stateGetRoomWithSearchPaging.name = '';
    this.stateGetRoomWithSearchPaging.roomNumber = '';
    this.stateGetRoomWithSearchPaging.floor = '';
    this.stateGetRoomWithSearchPaging.roomTypeId = '';
    this.stateGetRoomWithSearchPaging.status = '';
    this.name = '';
    this.roomNumber = '';
    this.floor = '';
    this.roomTypeId = '';
    this.status = '';
    this.stateGetRoomWithSearchPaging.page = this.currentPage;
    this.isFirstTimeSearch = true;
    this.getRoomWithSearchAndPaging();
    this.messageService.add({ severity: 'success', summary: 'Xóa bộ lọc', detail: 'Đã xóa bộ lọc tìm kiếm!' });
  }
}
