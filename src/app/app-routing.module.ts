import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { UserComponent } from './component/user/user.component';
import { RoomComponent } from './component/room/room.component';
import { RoomtypeComponent } from './component/roomtype/roomtype.component';
import { BookingComponent } from './component/booking/booking.component';
import { AuthGuard } from './utils/authguard.component';

const routes: Routes = [
  { path: '', redirectTo: 'quanlynguoidung', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
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
