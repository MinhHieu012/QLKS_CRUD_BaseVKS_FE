import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { Booking, BookingAdd, BookingUpdate, GetBookingWithSearchPaging, RoomForDropdownModal } from '../interface/booking.interface';
import { EnviromentComponent } from '../utils/enviroment.component';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private env: EnviromentComponent
  ) { }

  public getBookingWithSearchAndPaging(data: GetBookingWithSearchPaging) {
    let params = new HttpParams()
      .set('page', data.page ? data.page : '')
      .set('limit', '3')
      .set('bookingId', data.bookingId ? data.bookingId : '')
      .set('roomName', data.roomName ? data.roomName : '')
      .set('userName', data.userName ? data.userName : '')
      .set('checkInDate', data.checkInDate ? data.checkInDate.toString() : '')
      .set('checkoutDate', data.checkoutDate ? data.checkoutDate.toString() : '')
    const headers = this.localStorageService.header();
    return this.http.get(`${this.env.local}/admin/quanlydatphong/filter`, { params, headers });
  }

  public getBookingById(id: Number) {
    const headers = this.localStorageService.header();
    return this.http.get(`${this.env.local}/admin/quanlydatphong/lich/${id}`, { headers });
  }

  public getAllRoomForDropdown() {
    const headers = this.localStorageService.header();
    return this.http.get<RoomForDropdownModal>(`${this.env.local}/admin/quanlyphong`, { headers });
  }

  public getAllUserForDropdown() {
    const headers = this.localStorageService.header();
    return this.http.get(`${this.env.local}/admin/quanlyuser`, { headers });
  }

  public addBooking(dataAddBooking: BookingAdd) {
    const headers = this.localStorageService.header();
    return this.http.post<Booking>(`${this.env.local}/admin/quanlydatphong/add`, dataAddBooking, { headers });
  }

  public updateBooking(dataUpdateBooking: BookingUpdate) {
    console.log(dataUpdateBooking, 'check service');
    const headers = this.localStorageService.header();
    return this.http.put<Booking>(`${this.env.local}/admin/quanlydatphong/update/${dataUpdateBooking.id}`, dataUpdateBooking, { headers });
  }

  public updateBookingStatus(id: Number, status: String) {
    const headers = this.localStorageService.header();
    return this.http.put<Booking>(`${this.env.local}/admin/quanlydatphong/bookingstatus/${id}?status=${status}`, {}, { headers });
  }
}
