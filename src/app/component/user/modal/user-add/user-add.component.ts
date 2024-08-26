import { Component, EventEmitter, Output } from '@angular/core';
import { UserAdd } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  constructor(
    private userService: UserService
  ) { }

  @Output() callGetUserBackAfterAdd = new EventEmitter<String>();

  display: boolean = false;
  showDialog() {
    this.display = true;
  }

  dataAddUser: UserAdd = {
    username: '',
    email: '',
    password: '',
    phone: 0,
    identificationNumber: '',
    dateOfBirth: new Date()
  }

  clearModalDataAddUser() {
    this.dataAddUser = {
      username: '',
      email: '',
      password: '',
      phone: 0,
      identificationNumber: '',
      dateOfBirth: new Date()
    }
  }

  handleAddUser() {
    this.userService.addUser(this.dataAddUser).subscribe(() => {
      this.clearModalDataAddUser();
      this.callGetUserBackAfterAdd.emit();
      this.display = false;
    })
  }
}