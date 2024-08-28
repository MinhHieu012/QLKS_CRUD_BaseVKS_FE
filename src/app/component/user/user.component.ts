import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { GetUserWithSearchPaging, User } from '../../interface/user.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getUserWithSearchAndPaging();
  }

  listUser: User[] = [];
  errorMessage: String = '';
  fieldErrors: any = {};

  username?: string | number | boolean;
  phone?: string | number | boolean;
  identificationNumber?: string | number | boolean;
  isFirstTimeSearch: boolean = true;

  totalItem: number = 0;
  totalPage: number = 0;
  page: number = 1;
  limit: number = 5;

  stateGetUserWithSearchPaging: GetUserWithSearchPaging = {
    page: 1,
    limit: 5,
    username: '',
    phone: '',
    identificationNumber: ''
  }

  getUserWithSearchAndPaging() {
    this.userService.getAllUsers(this.stateGetUserWithSearchPaging).subscribe((data: any) => {
      if (data.result.content.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy người dùng nào!' });
      } 
      if (this.isFirstTimeSearch === true && data.result.content.length > 0 && this.stateGetUserWithSearchPaging.username !== '' || this.stateGetUserWithSearchPaging.phone !== '' || this.stateGetUserWithSearchPaging.identificationNumber !== '') {
        this.messageService.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Đã tìm thấy user!' });
      }
      this.listUser = data.result.content;
      this.totalItem = data.result.totalElements;
      this.totalPage = data.result.totalPages;
      console.log(this.isFirstTimeSearch);
      
    });
  }

  getUserBackAfterAddUpate() {
    this.getUserWithSearchAndPaging();
  }

  confirmLockUser(eventLockUser: Event, id: String, username: String) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.lockUser(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Khóa', detail: `Đã khóa người dùng có họ tên là ${username}` });
            this.getUserWithSearchAndPaging();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error) {
              this.messageService.add({ severity: 'error', summary: 'Khóa', detail: `Người dùng có họ tên là ${username} chưa bị khóa!` });
              this.fieldErrors = error.error.result;
            } else {
              this.errorMessage = "Lỗi không xác định!";
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Khóa', detail: `Người dùng có họ tên là ${username} chưa bị khóa!` });
      }
    });
  }

  confirmUnLockUser(eventLockUser: Event, id: String, username: String) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn mở khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.unLockUser(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Mở khóa', detail: 'Đã mở khóa người dùng này!' });
            this.getUserWithSearchAndPaging();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error) {
              this.messageService.add({ severity: 'error', summary: 'Mở khóa', detail: `Người dùng có họ tên là ${username} chưa được mở khóa!` });
              this.fieldErrors = error.error.result;
            } else {
              this.errorMessage = "Lỗi không xác định!";
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Mở khóa', detail: 'Người dùng chưa được mở khóa!' });
      }
    });
  }

  handleSearch() {
    this.stateGetUserWithSearchPaging.username = this.username || '';
    this.stateGetUserWithSearchPaging.phone = this.phone || '';
    this.stateGetUserWithSearchPaging.identificationNumber = this.identificationNumber || '';
    this.isFirstTimeSearch = true;
    this.getUserWithSearchAndPaging();
  }

  onPageChange(event: any) {
    this.stateGetUserWithSearchPaging.page = event.page + 1;
    this.isFirstTimeSearch = false;
    this.getUserWithSearchAndPaging();
  }
}