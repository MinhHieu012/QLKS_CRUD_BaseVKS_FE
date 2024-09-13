import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { IAccount } from '../../interface/login.interface';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonComponent } from '../../utils/common.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private commmonFunc: CommonComponent,
    private appComponent: AppComponent
  ) { }

  account: IAccount = {
    username: "",
    email: "",
    password: ""
  }

  handleLogin() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (isExistTokenOrLoggedIn) {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn đã đăng nhập rồi!" });
    } else {
      this.loginService.login(this.account).subscribe({
        next: (data) => {
          localStorage.setItem("token", JSON.stringify(data));
          this.router.navigate(['/quanlynguoidung']);
          this.appComponent.checkLoginStatus();
          this.messageService.add({ severity: 'success', summary: 'Đăng nhập', detail: 'Đăng nhập thành công!' });
          this.clearFormRegister();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `Thông tin đăng nhập không đúng!` });
          }
          if (error.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `Thông tin đăng nhập không đúng!` });
          }
          const fieldErrors = error.error.result;
          if (fieldErrors.lockedAccount) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.lockedAccount}` });
          }
          if (fieldErrors.invalidRoleAccess) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.invalidRoleAccess}` });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Lỗi không xác định!" });
          }
        }
      })
    }
  }

  clearFormRegister() {
    this.account.username = "";
    this.account.email = "";
    this.account.password = "";
  }
}
