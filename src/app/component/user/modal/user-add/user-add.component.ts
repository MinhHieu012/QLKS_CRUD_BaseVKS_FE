import { Component, EventEmitter, Output } from '@angular/core';
import { UserAdd } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.userAddForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      identificationNumber: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userAddForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  @Output() callGetUserBackAfterAdd = new EventEmitter<String>();

  userAddForm: FormGroup;
  isSubmitDisabled: boolean = true;

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
    this.userService.addUser(this.userAddForm.value).subscribe({
      next: () => {
        this.display = false;
        this.callGetUserBackAfterAdd.emit();
        this.showAddSuccessNotification();
        this.clearModalDataAddUser();
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
    this.fieldErrors = {};
    this.errorMessage = '';
    this.isSubmitDisabled = true;
    this.userAddForm.reset();
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm người dùng thành công!' });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm người dùng thất bại!' });
  }
}