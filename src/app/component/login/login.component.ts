import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { IAccount } from '../../interface/login.interface';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) { }

  account: IAccount = {
    username: "",
    email: "",
    password: ""
  }

  handleLogin() {
    this.loginService.login(this.account).subscribe({
      next: (data) => {
        localStorage.setItem("token", JSON.stringify(data)); //Lưu token trả về vào local storage
        this.router.navigate(['/quanlynguoidung']);
        this.messageService.add({ severity: 'success', summary: 'Đăng nhập', detail: 'Đăng nhập thành công!' });
        this.clearFormRegister();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          const fieldErrors = error.error.result;
          if (fieldErrors.lockedAccount) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.lockedAccount}` });
          }
        }
      }
    })
  }

  clearFormRegister() {
    this.account.username = "";
    this.account.email = "";
    this.account.password = "";
  }
}
