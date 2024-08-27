import { Component, EventEmitter, Output } from '@angular/core';
import { UserAdd } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  @Output() callGetUserBackAfterAdd = new EventEmitter<String>();

  errorMessage: String = '';
  fieldErrors: any = {};

  display: boolean = false;
  showDialog() {
    this.display = true;
  }

  dataAddUser: UserAdd = {
    username: '',
    email: '',
    password: '',
    phone: '',
    identificationNumber: '',
    dateOfBirth: new Date()
  }

  handleAddUser() {
    this.userService.addUser(this.dataAddUser).subscribe({
      next: () => {
        this.clearModalDataAddUser();
        this.callGetUserBackAfterAdd.emit();
        this.display = false;
        this.showAddSuccessNotification();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.showAddFailedNotification();
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    });
  }

  clearModalDataAddUser() {
    this.dataAddUser = {
      username: '',
      email: '',
      password: '',
      phone: '',
      identificationNumber: '',
      dateOfBirth: new Date()
    }
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm người dùng thành công!' });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm người dùng thất bại!' });
  }
}