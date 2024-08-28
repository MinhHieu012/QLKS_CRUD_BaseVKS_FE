import { Component } from '@angular/core';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {}
  title = 'vks-fe-angular';

  handleLogout() {
    this.loginService.logout().subscribe(() => {
      localStorage.removeItem("token");
      this.router.navigate(['/login']);
      this.messageService.add({ severity: 'success', summary: 'Đăng xuất', detail: 'Bạn đã đăng xuất thành công!' });
    })
  }
}
