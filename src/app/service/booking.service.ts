import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';
import { GetBookingWithSearchPaging } from '../interface/booking.interface';

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
}
