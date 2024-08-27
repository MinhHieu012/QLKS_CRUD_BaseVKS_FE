import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    this.getAllUsers();
  }

  listUser: User[] = [];

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.listUser = data.result;
    });
  }

  getUserBackAfterAddUpate() {
    this.getAllUsers();
  }

  confirmLockUser(eventLockUser: Event) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Khóa', detail: 'Đã khóa người dùng này!' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Khóa', detail: 'Người dùng chưa bị khóa!' });
      }
    });
  }

  confirmUnLockUser(eventLockUser: Event) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn mở khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Mở khóa', detail: 'Đã mở khóa người dùng này!' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Mở khóa', detail: 'Người dùng chưa được mở khóa!' });
      }
    });
  }
}
