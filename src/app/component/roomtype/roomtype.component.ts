import { Component } from '@angular/core';
import { RoomtypeService } from '../../service/roomtype.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetRoomTypeWithSearchPaging, RoomType } from '../../interface/roomtype.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { style } from '@angular/animations';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrl: './roomtype.component.css'
})
export class RoomtypeComponent {
  constructor(
    private roomTypeService: RoomtypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getRoomTypeWithSearchAndPaging();
  }
  
  listRoomType: RoomType[] = [];
  errorMessage: String = '';
  fieldErrors: any = {};

  name?: string | number | boolean;
  maxPeople?: string | number | boolean;
  isFirstTimeSearch: boolean = true;

  totalItem: number = 0;
  totalPage: number = 0;
  page: number = 1;
  limit: number = 5;

  isLoading: boolean = true;

  stateGetRoomTypeWithSearchPaging: GetRoomTypeWithSearchPaging = {
    page: 1,
    limit: 5,
    name: '',
    maxPeople: ''
  }

  getRoomTypeWithSearchAndPaging() {
    this.isLoading = true;
    this.roomTypeService.getRoomTypeWithSearchAndPaging(this.stateGetRoomTypeWithSearchPaging).subscribe((data: any) => {
      if (data.result.content.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy loại phòng nào!' });
        this.isLoading = false;
      } 
      if (this.isFirstTimeSearch === true && data.result.content.length > 0 && this.stateGetRoomTypeWithSearchPaging.name !== '' || this.stateGetRoomTypeWithSearchPaging.maxPeople !== '') {
        this.messageService.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Đã tìm thấy loại phòng!' });
        this.isLoading = false;
      }
      this.listRoomType = data.result.content;
      this.totalItem = data.result.totalElements;
      this.totalPage = data.result.totalPages;
      this.isLoading = false;   
    }
  )}

  getRoomTypeBackAfterAddUpate() {
    this.getRoomTypeWithSearchAndPaging();
  }

  confirmDeleteRoomType(eventDeleteRoomType: Event, id: Number, name: String) {
    this.confirmationService.confirm({
      target: eventDeleteRoomType.target as EventTarget,
      message: `Bạn chắc chắn muốn xóa loại phòng "${name}"?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roomTypeService.deleteRoomType(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Xóa', detail: `Đã xóa loại phòng "${name}"!` });
            this.getRoomTypeWithSearchAndPaging();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error) {
              const fieldErrors = error.error.result;
              this.messageService.add({ severity: 'error', summary: 'Xóa', detail: `${fieldErrors.errorDelete}` });
            } else {
              this.errorMessage = "Lỗi không xác định!";
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Xóa', detail: `Loại phòng "${name}" chưa bị xóa!` });
      }
    });
  }

  handleSearch() {
    this.stateGetRoomTypeWithSearchPaging.name = this.name || '';
    this.stateGetRoomTypeWithSearchPaging.maxPeople = this.maxPeople || '';
    this.isFirstTimeSearch = true;
    this.getRoomTypeWithSearchAndPaging();
  }

  handleResetFilter() {
    this.stateGetRoomTypeWithSearchPaging.name = '';
    this.stateGetRoomTypeWithSearchPaging.maxPeople = '';
    this.name = '';
    this.maxPeople = '';
    this.getRoomTypeWithSearchAndPaging();
    this.isFirstTimeSearch = true;
    this.messageService.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Đã xóa bộ lọc tìm kiếm!' });
  }

  onPageChange(event: any) {
    this.stateGetRoomTypeWithSearchPaging.page = event.page + 1;
    this.isFirstTimeSearch = false;
    this.getRoomTypeWithSearchAndPaging();
  }
}
