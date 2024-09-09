import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RoomtypeService } from '../../../../service/roomtype.service';
import { RoomTypeAddUpdate } from '../../../../interface/roomtype.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../../service/local-storage-service.service';
import { CommonComponent } from '../../../../utils/common.component';

@Component({
  selector: 'app-roomtype-add',
  templateUrl: './roomtype-add.component.html',
  styleUrl: './roomtype-add.component.css'
})
export class RoomtypeAddComponent {
  constructor(
    private roomTypeService: RoomtypeService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commmonFunc: CommonComponent,
  ) {
    this.roomTypeAddForm = this.fb.group({
      name: ['', [Validators.required]],
      maxPeople: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.roomTypeAddForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  @Output() callGetRoomTypeBackAfterAddUpdate = new EventEmitter<String>();

  roomTypeAddForm: FormGroup;
  isSubmitDisabled: boolean = true;

  errorMessage: String = '';
  fieldErrors: any = {};

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.clearModalDataAddRoomType();
  }

  dataAddRoomType: RoomTypeAddUpdate = {
    name: '',
    maxPeople: '',
    description: '',
  }

  handleAddRoomType() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.roomTypeService.addRoomType(this.roomTypeAddForm.value).subscribe({
        next: () => {
          this.display = false;
          this.callGetRoomTypeBackAfterAddUpdate.emit();
          this.showAddSuccessNotification();
          this.clearModalDataAddRoomType();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.showAddFailedNotification();
            this.fieldErrors = error.error.result;
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      })
    }
  }

  clearModalDataAddRoomType() {
    this.dataAddRoomType = {
      name: '',
      maxPeople: '',
      description: '',
    }
    this.fieldErrors = {};
    this.errorMessage = '';
    this.isSubmitDisabled = true;
    this.roomTypeAddForm.reset();
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm loại phòng thành công!' });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm loại phòng thất bại!' });
  }
}
