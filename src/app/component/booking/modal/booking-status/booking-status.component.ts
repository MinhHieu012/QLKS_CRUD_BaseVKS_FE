import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, BookingStatus, BookingUpdate, RoomForDropdownModal, UserForDropdownModal } from '../../../../interface/booking.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonComponent } from '../../../../utils/common.component';
import { BookingService } from '../../../../service/booking.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrl: './booking-status.component.css'
})
export class BookingStatusComponent {
  constructor(
    private bookingService: BookingService,
    private commmonFunc: CommonComponent,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getAllRoomForDropdown();
    this.getAllUserForDropdown();
    this.bookingStatus = [
      { name: 'PENDING', code: 'Chờ duyệt' },
      { name: 'APPROVED', code: 'Đã duyệt' },
      { name: 'CANCEL', code: 'Đã hủy' }
    ];
  }

  display: boolean = false;

  bookingStatus: BookingStatus[] = [];

  fieldErrors: any = {};
  errorMessage: String = '';

  formattedCheckInDate: String = '';
  formattedCheckOutDate: String = '';

  roomForDropdown: RoomForDropdownModal[] = [];
  userForDropdown: UserForDropdownModal[] = [];

  @Input() bookingDataIdFromParent: String = '';
  @Input() bookingDataRoomIdFromParent: String = '';
  @Input() bookingDataUserIdFromParent: String = '';
  @Input() bookingDataCheckInDateFromParent: String = '';
  @Input() bookingDataCheckOutDateFromParent: String = '';
  @Input() bookingDataDepositFromParent: String = '';
  @Input() bookingDataAmountFromParent: String = '';
  @Input() bookingDataStatusFromParent: String = '';
  @Output() callGetBookingBackAfterAddUpdate = new EventEmitter<String>();

  dataBookingSendToUpdate: BookingUpdate = {
    id: '',
    roomId: '',
    userId: '',
    checkInDate: '',
    checkoutDate: '',
    deposit: '',
    amount: '',
    status: ''
  };

  showDialog() {
    this.dataBookingSendToUpdate.id = this.bookingDataIdFromParent;
    this.dataBookingSendToUpdate.roomId = this.bookingDataRoomIdFromParent;
    this.dataBookingSendToUpdate.userId = this.bookingDataUserIdFromParent;
    this.dataBookingSendToUpdate.checkInDate = new Date(this.bookingDataCheckInDateFromParent as string);
    this.dataBookingSendToUpdate.checkoutDate = new Date(this.bookingDataCheckOutDateFromParent as string);
    this.dataBookingSendToUpdate.deposit = this.bookingDataDepositFromParent;
    this.dataBookingSendToUpdate.amount = this.bookingDataAmountFromParent;
    this.dataBookingSendToUpdate.status = this.bookingDataStatusFromParent;
    this.display = true;
  }

  getAllRoomForDropdown() {
    this.bookingService.getAllRoomForDropdown().subscribe((data: any) => {
      this.roomForDropdown = data.result;
    });
  }

  getAllUserForDropdown() {
    this.bookingService.getAllUserForDropdown().subscribe((data: any) => {
      this.userForDropdown = data.result;
    });
  }

  convertToISOStringWithoutOffset(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
    return localISOTime;
  }

  handleUpdateStatusBooking() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.bookingService.updateBookingStatus(Number(this.dataBookingSendToUpdate.id), this.dataBookingSendToUpdate.status).subscribe({
        next: () => {
          this.display = false;
          this.callGetBookingBackAfterAddUpdate.emit();
          this.showUpdateSuccessNotification(Number(this.dataBookingSendToUpdate.id));
          this.clearModalDataUpdateBooking();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.fieldErrors = error.error.result;
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      });
    }
  }

  clearModalDataUpdateBooking() {
    this.dataBookingSendToUpdate = {
      id: '',
      userId: '',
      roomId: '',
      checkInDate: '',
      checkoutDate: '',
      deposit: '',
      amount: '',
      status: ''
    }
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showUpdateSuccessNotification(id: Number) {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Cập nhật lịch đặt ${id} thành công!` });
  }

  showUpdateFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật lịch đặt thất bại!' });
  }
}
