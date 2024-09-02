import { Component, EventEmitter, Output } from '@angular/core';
import { RoomAdd, RoomTypeForDropdown } from '../../../../interface/room.interface';
import { RoomService } from '../../../../service/room.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    this.roomAddForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      roomNumber: ['', [Validators.required]],
      floor: ['', [Validators.required]],
      roomTypeId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.getAllRoomTypeForDropdown();
    this.roomAddForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  roomAddForm: FormGroup;
  isSubmitDisabled: boolean = true;

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
    this.roomService.addRoom(this.roomAddForm.value).subscribe({
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
    this.isSubmitDisabled = true;
    this.roomAddForm.reset();
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Thêm phòng thành công!` });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm phòng thất bại!' });
  }
}
