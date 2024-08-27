import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserUpdate } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.formatDateFromISODateToYYYYMMDD();
  }

  display: boolean = false;
  formattedDate: String = '';
  errorMessage: String = '';
  fieldErrors: any = {};

  @Input() userDataIdFromParent: String = '';
  @Input() userDataUsernameFromParent: String = '';
  @Input() userDataEmailFromParent: String = '';
  @Input() userDataPhoneFromParent: String = '';
  @Input() userDataIdentificationNumberFromParent: String = '';
  @Input() userDataDateOfBirthFromParent: String = '';
  @Output() callGetCustomersBackAfterUpdate = new EventEmitter<String>();

  dataUserSendToUpdate: UserUpdate = {
    id: '',
    username: '',
    email: '',
    phone: '',
    identificationNumber: '',
    dateOfBirth: ''
  }

  formatDateFromISODateToYYYYMMDD() {
    const rawDate = this.userDataDateOfBirthFromParent;
    const primitiveRawDate = String(rawDate);
    const date = new Date(primitiveRawDate);
    this.formattedDate = date.toISOString().split('T')[0];
  }

  showDialog() {
    this.dataUserSendToUpdate.id = this.userDataIdFromParent;
    this.dataUserSendToUpdate.username = this.userDataUsernameFromParent;
    this.dataUserSendToUpdate.email = this.userDataEmailFromParent;
    this.dataUserSendToUpdate.phone = this.userDataPhoneFromParent;
    this.dataUserSendToUpdate.identificationNumber = this.userDataIdentificationNumberFromParent;
    this.dataUserSendToUpdate.dateOfBirth = this.formattedDate
    this.display = true;
  }

  handleUpdateUser() {
    this.userService.updateUser(this.dataUserSendToUpdate).subscribe({
      next: () => {
        this.clearModalDataUpdateUser();
        this.callGetCustomersBackAfterUpdate.emit();
        this.display = false;
        this.showUpdateSuccessNotification();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.showUpdateFailedNotification();
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    })
  }

  clearModalDataUpdateUser() {
    this.dataUserSendToUpdate = {
      id: '',
      username: '',
      email: '',
      phone: '',
      identificationNumber: '',
      dateOfBirth: ''
    }
  }

  showUpdateSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật người dùng thành công!' });
  }

  showUpdateFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật người dùng thất bại!' });
  }
}