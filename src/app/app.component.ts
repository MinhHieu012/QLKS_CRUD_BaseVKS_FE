import { Component } from '@angular/core';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonComponent } from './utils/common.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  margin: any;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private commonFunc: CommonComponent
  ) { }

  title = 'vks-fe-angular';

  isLoggedIn: boolean = false;

  role: String = '';
  username: String = '';

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const isExistTokenOrLoggedIn = this.commonFunc.checkUserRoleOrLoggedIn();
    this.handleShowRoleOnSidebar();
    if (!isExistTokenOrLoggedIn) {
      this.isLoggedIn = false;
    }
    else {
      this.isLoggedIn = true;
    }
  }

  handleLogout() {
    if (this.isLoggedIn == false) {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Bạn chưa đăng nhập!' });
    } else {
      this.loginService.logout().subscribe(() => {
        localStorage.removeItem("token");
        this.router.navigate(['/login']);
        this.checkLoginStatus();
        this.messageService.add({ severity: 'success', summary: 'Đăng xuất', detail: 'Bạn đã đăng xuất thành công!' });
      })
    }
  }

  handleShowRoleOnSidebar() {
    let roleRaw = this.commonFunc.checkUserRoleUsingJwt();
    if (roleRaw == "admin") {
      this.role = "Quản trị viên";
    } if (roleRaw == "manager") {
      this.role = "NV quản lý";
    } if (roleRaw == null) {
      this.role = "Khách";
    }
  }
}
