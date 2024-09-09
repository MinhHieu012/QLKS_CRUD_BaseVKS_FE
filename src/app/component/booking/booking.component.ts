import { Component } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Booking, GetBookingWithSearchPaging } from '../../interface/booking.interface';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getBookingWithSearchAndPaging();
  }

  listBooking: Booking[] = [];

  isLoading: boolean = true;
  errorMessage: String = '';
  fieldErrors: any = {};

  bookingId: string | number | boolean = '';
  roomName: string | number | boolean = '';
  userName: string | number | boolean = '';
  checkInDate: string | number | boolean = '';
  checkOutDate: string | number | boolean = '';
  isFirstTimeSearch: boolean = true;

  totalItem: number = 0;
  totalPage: number = 0;
  page: number = 1;
  limit: number = 3;
  currentPage: number = 1;

  stateGetBookingWithSearchPaging: GetBookingWithSearchPaging = {
    page: 1,
    limit: 3,
    bookingId: '',
    roomName: '',
    userName: '',
    checkInDate: '',
    checkoutDate: ''
  }

  getBookingWithSearchAndPaging() {
    this.isLoading = true;
    this.bookingService.getBookingWithSearchAndPaging(this.stateGetBookingWithSearchPaging).subscribe((data: any) => {
      if (data.result.content.length === 0) {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Tìm kiếm', detail: 'Không tìm thấy lịch đặt nào!' });
      }
      if (this.isFirstTimeSearch === true && data.result.content.length > 0 && this.stateGetBookingWithSearchPaging.bookingId !== '' || this.stateGetBookingWithSearchPaging.roomName !== '' || this.stateGetBookingWithSearchPaging.userName !== '' || this.stateGetBookingWithSearchPaging.checkInDate !== '' || this.stateGetBookingWithSearchPaging.checkoutDate !== '') {
        this.messageService.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Tìm thấy ' + data.result.totalElements + ' lịch đặt!' });
        this.isLoading = false;
      }
      this.listBooking = data.result.content;
      this.totalItem = data.result.totalElements;
      this.totalPage = data.result.totalPages;
      this.page = this.stateGetBookingWithSearchPaging.page
      this.isLoading = false;
    })
  }

  getAllBookingAgain() {
    this.stateGetBookingWithSearchPaging.page = this.currentPage;
    this.getBookingWithSearchAndPaging();
  }

  handleSearch() {
    this.stateGetBookingWithSearchPaging.bookingId = this.bookingId || '';
    this.stateGetBookingWithSearchPaging.roomName = this.roomName || '';
    this.stateGetBookingWithSearchPaging.userName = this.userName || '';
    this.stateGetBookingWithSearchPaging.checkInDate = this.convertDateToISOFormatWithTimezone(this.checkInDate);
    this.stateGetBookingWithSearchPaging.checkoutDate = this.convertDateToISOFormatWithTimezone(this.checkOutDate);
    this.isFirstTimeSearch = true;
    this.getBookingWithSearchAndPaging();
  }

  convertDateToISOFormatWithTimezone(date: any): string {
    if (typeof date !== 'boolean' && date) {
      const localDate = new Date(date);
      const timezoneOffset = localDate.getTimezoneOffset() * 60000; // Chênh lệch múi giờ tính bằng milliseconds
      const adjustedDate = new Date(localDate.getTime() - timezoneOffset);
      return adjustedDate.toISOString()
    } else {
      return '';
    }
  }

  handleResetFilter() {
    this.stateGetBookingWithSearchPaging.bookingId = '';
    this.stateGetBookingWithSearchPaging.roomName = '';
    this.stateGetBookingWithSearchPaging.userName = '';
    this.stateGetBookingWithSearchPaging.checkInDate = '';
    this.stateGetBookingWithSearchPaging.checkoutDate = '';
    this.bookingId = '';
    this.roomName = '';
    this.userName = '';
    this.checkInDate = '';
    this.checkOutDate = '';
    this.stateGetBookingWithSearchPaging.page = this.currentPage;
    this.getBookingWithSearchAndPaging();
    this.isFirstTimeSearch = true;
    this.messageService.add({ severity: 'success', summary: 'Xóa bộ lọc', detail: 'Đã xóa bộ lọc tìm kiếm!' });
  }

  onPageChange(event: any) {
    this.stateGetBookingWithSearchPaging.page = event.page + 1;
    this.isFirstTimeSearch = false;
    this.getBookingWithSearchAndPaging();
  }
}
