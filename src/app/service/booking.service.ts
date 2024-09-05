import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { Booking, BookingAdd, BookingUpdate, GetBookingWithSearchPaging, RoomForDropdownModal } from '../interface/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
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
    return this.http.get('http://localhost:8080/admin/quanlydatphong/filter', { params });
  }

  public getBookingById(id: Number) {
    return this.http.get(`http://localhost:8080/admin/quanlydatphong/lich/${id}`);
  }

  public getAllRoomForDropdown() {
    return this.http.get<RoomForDropdownModal>('http://localhost:8080/admin/quanlyphong');
  }

  public getAllUserForDropdown() {
    return this.http.get('http://localhost:8080/admin/quanlyuser');
  }

  public addBooking(dataAddBooking: BookingAdd) {
    const headers = this.localStorageService.header();
    return this.http.post<Booking>('http://localhost:8080/admin/quanlydatphong/add', dataAddBooking, { headers });
  }

  public updateBooking(dataUpdateBooking: BookingUpdate) {
    console.log(dataUpdateBooking, 'check service');
    const headers = this.localStorageService.header();
    return this.http.put<Booking>(`http://localhost:8080/admin/quanlydatphong/update/${dataUpdateBooking.id}`, dataUpdateBooking, { headers });
  }

  public updateBookingStatus(id: Number, status: String) {
    const headers = this.localStorageService.header();
    return this.http.put<Booking>(`http://localhost:8080/admin/quanlydatphong/bookingstatus/${id}?status=${status}`, {}, { headers });
  }
}
