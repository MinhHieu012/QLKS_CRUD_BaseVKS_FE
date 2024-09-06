import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserUpdate } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../../service/local-storage-service.service';
import { CommonComponent } from '../../../../utils/common.component';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commmonFunc: CommonComponent,
  ) {
    this.userUpdateForm = this.fb.group({
      username: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      identificationNumber: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userUpdateForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
    this.formatDateFromISODateToYYYYMMDD();
  }

  userUpdateForm: FormGroup;
  isSubmitDisabled: boolean = true;

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
  @Input() userDataStatusFromParent: String = '';
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
    if (this.userDataStatusFromParent === 'LOCKED') {
      this.display = false;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "User đang bị khóa! Không thể cập nhật" });
    } else {
      this.dataUserSendToUpdate.id = this.userDataIdFromParent;
      this.dataUserSendToUpdate.username = this.userDataUsernameFromParent;
      this.dataUserSendToUpdate.email = this.userDataEmailFromParent;
      this.dataUserSendToUpdate.phone = this.userDataPhoneFromParent;
      this.dataUserSendToUpdate.identificationNumber = this.userDataIdentificationNumberFromParent;
      this.dataUserSendToUpdate.dateOfBirth = this.formattedDate
      this.display = true;
    }
  }

  handleUpdateUser() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.userService.updateUser(this.dataUserSendToUpdate).subscribe({
        next: () => {
          this.display = false;
          this.callGetCustomersBackAfterUpdate.emit();
          this.showUpdateSuccessNotification();
          this.clearModalDataUpdateUser();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            const fieldErrors = error.error.result;
            if (fieldErrors.locked) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.locked}`});
            }
            if (fieldErrors.username) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.username}`});
            }
            if (fieldErrors.phone) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.phone}`});
            }
            if (fieldErrors.email) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.email}`});
            }
            if (fieldErrors.identificationNumber) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.identificationNumber}`});
            }
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      })
    }
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
    this.fieldErrors = {};
    this.errorMessage = '';
    this.isSubmitDisabled = true;
    this.userUpdateForm.reset();
  }

  showUpdateSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật người dùng thành công!' });
  }
}