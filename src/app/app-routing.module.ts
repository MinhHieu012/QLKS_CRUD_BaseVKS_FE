import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserComponent } from './component/user/user.component';
import { RoomComponent } from './component/room/room.component';
import { RoomtypeComponent } from './component/roomtype/roomtype.component';
import { BookingComponent } from './component/booking/booking.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'quanlynguoidung', component: UserComponent },
  { path: 'quanlyphong', component: RoomComponent },
  { path: 'quanlykieuphong', component: RoomtypeComponent },
  { path: 'quanlydatphong', component: BookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
