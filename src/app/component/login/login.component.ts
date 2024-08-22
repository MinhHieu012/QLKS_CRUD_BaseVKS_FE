import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { IAccount } from '../../interface/login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  account: IAccount = {
    username: "",
    fullName: "",
    password: "",
    role: ""
  }

  handleRegister() {
    this.loginService.register(this.account).subscribe({
      next: (data) => {
        localStorage.setItem("token", JSON.stringify(data)); //Lưu token trả về vào local storage
        this.router.navigate(['/product']);
        this.clearFormRegister();
      },
      error: (e) => {
        alert(e);
      }
    })
  }

  clearFormRegister() {
    this.account.username = "";
    this.account.fullName = "";
    this.account.password = "";
    this.account.role = "";
  }
}
