import { Component } from '@angular/core';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  display: boolean = false;

  showDialog() {
    this.display = true;
  }
}
