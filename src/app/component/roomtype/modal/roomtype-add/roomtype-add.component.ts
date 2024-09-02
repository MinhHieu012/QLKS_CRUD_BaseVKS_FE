import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RoomtypeService } from '../../../../service/roomtype.service';
import { RoomTypeAddUpdate } from '../../../../interface/roomtype.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-roomtype-add',
  templateUrl: './roomtype-add.component.html',
  styleUrl: './roomtype-add.component.css'
})
export class RoomtypeAddComponent {
  constructor(
    private roomTypeService: RoomtypeService,
    private messageService: MessageService,
  ) { }

  @Output() callGetRoomTypeBackAfterAddUpdate = new EventEmitter<String>();

  errorMessage: String = '';
  fieldErrors: any = {};

  display: boolean = false;
  showDialog() {
    this.display = true;
  }

  dataAddRoomType: RoomTypeAddUpdate = {
    name: '',
    maxPeople: '',
    description: '',
  }

  handleAddRoomType() {
    this.roomTypeService.addRoomType(this.dataAddRoomType).subscribe({
      next: () => {
        this.display = false;
        this.callGetRoomTypeBackAfterAddUpdate.emit();
        this.showAddSuccessNotification();
        this.clearModalDataAddRoomType();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.showAddFailedNotification();
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    })
  }

  clearModalDataAddRoomType() {
    this.dataAddRoomType = {
      name: '',
      maxPeople: '',
      description: '',
    }
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm loại phòng thành công!' });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm loại phòng thất bại!' });
  }
}
