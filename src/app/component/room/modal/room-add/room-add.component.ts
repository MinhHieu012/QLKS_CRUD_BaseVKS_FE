import { Component, EventEmitter, Output } from '@angular/core';
import { RoomAdd, RoomTypeForDropdown } from '../../../../interface/room.interface';
import { RoomService } from '../../../../service/room.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.css'
})
export class RoomAddComponent {
  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { 
    // this.roomAddForm = this.formBuilder.group({
    //   roomName: ['', [
    //     Validators.required,
    //     Validators.maxLength(100),
    //     Validators.pattern(/^[a-zA-Z0-9 ]*$/)
    //   ]]
    // });
  }

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
  }

  display: boolean = false;
  fieldErrors: any = {};
  errorMessage: String = '';

  roomType: RoomTypeForDropdown[] = [];

  @Output() callGetRoomBackAfterAddUpdate = new EventEmitter<String>();
  dataRoomAdd: RoomAdd = {
    name: '',
    roomNumber: '',
    floor: '',
    roomTypeId: 0,
    description: '',
    price: ''
  }

  showDialog() {
    this.display = true;
  }

  getAllRoomTypeForDropdown() {
    this.roomService.getAllRoomTypeForDropdown().subscribe((data: any) => {
      this.roomType = data.result;
    })
  }

  handleAddRoom() {
    this.roomService.addRoom(this.dataRoomAdd).subscribe({
      next: () => {
        this.display = false;
        this.callGetRoomBackAfterAddUpdate.emit();
        this.showAddSuccessNotification();
        this.clearModalDataAddRoom();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    });
  }

  clearModalDataAddRoom() {
    this.dataRoomAdd = {
      name: '',
      roomNumber: '',
      floor: '',
      roomTypeId: 0,
      description: '',
      price: ''
    }
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Thêm phòng thành công!` });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm phòng thất bại!' });
  }
}
