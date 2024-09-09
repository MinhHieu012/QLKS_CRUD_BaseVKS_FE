import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, BookingStatus, BookingUpdate, RoomForDropdownModal, UserForDropdownModal } from '../../../../interface/booking.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonComponent } from '../../../../utils/common.component';
import { BookingService } from '../../../../service/booking.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-booking-update',
  templateUrl: './booking-update.component.html',
  styleUrl: './booking-update.component.css'
})
export class BookingUpdateComponent {
  constructor(
    private bookingService: BookingService,
    private commmonFunc: CommonComponent,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.bookingUpdateForm = this.formBuilder.group({
      roomId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      checkInDate: ['', [Validators.required]],
      checkoutDate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      deposit: [''],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.getAllRoomForDropdown();
    this.getAllUserForDropdown();
    this.bookingStatus = [
      { name: 'PENDING', code: 'Chờ duyệt' },
      { name: 'APPROVED', code: 'Đã duyệt' },
      { name: 'CANCEL', code: 'Đã hủy' }
    ];
    this.bookingUpdateForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  display: boolean = false;

  bookingStatus: BookingStatus[] = [];

  fieldErrors: any = {};
  errorMessage: String = '';

  bookingUpdateForm: FormGroup;
  isSubmitDisabled: boolean = true;

  formattedCheckInDate: String = '';
  formattedCheckOutDate: String = '';

  @Input() bookingDataIdFromParent: String = '';
  @Input() bookingDataRoomIdFromParent: String = '';
  @Input() bookingDataUserIdFromParent: String = '';
  @Input() bookingDataCheckInDateFromParent: String = '';
  @Input() bookingDataCheckOutDateFromParent: String = '';
  @Input() bookingDataDepositFromParent: String = '';
  @Input() bookingDataAmountFromParent: String = '';
  @Input() bookingDataStatusFromParent: String = '';
  @Output() callGetBookingBackAfterAddUpdate = new EventEmitter<String>();

  roomForDropdown: RoomForDropdownModal[] = [];
  userForDropdown: UserForDropdownModal[] = [];

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

  closeDialog() {
    this.clearModalDataUpdateBooking();
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

  handleUpdateBooking() {
    const checkInDate = this.bookingUpdateForm.get('checkInDate')?.value;
    const checkoutDate = this.bookingUpdateForm.get('checkoutDate')?.value;

    if (checkInDate) {
      this.dataBookingSendToUpdate.checkInDate = this.convertToISOStringWithoutOffset(new Date(checkInDate as string));
    }

    if (checkoutDate) {
      this.dataBookingSendToUpdate.checkoutDate = this.convertToISOStringWithoutOffset(new Date(checkoutDate as string));
    }

    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.bookingService.updateBooking(this.dataBookingSendToUpdate).subscribe({
        next: () => {
          this.display = false;
          this.callGetBookingBackAfterAddUpdate.emit();
          this.showUpdateSuccessNotification();
          this.clearModalDataUpdateBooking();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.fieldErrors = error.error.result;
            const fieldErrors = error.error.result;
            if (fieldErrors.inValidRoomStatusBooking) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.inValidRoomStatusBooking}`});
            }
            if (fieldErrors.bookingExists) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.bookingExists}`});
            }
            if (fieldErrors.bookingExistsInRange) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.bookingExistsInRange}` });
            }
            if (fieldErrors.roomExists) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.roomExists}` });
            }
            if (fieldErrors.userExists) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.userExists}` });
            }
            if (fieldErrors.bookingInValid) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.bookingInValid}` });
            }
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      })
    }

  }

  clearModalDataUpdateBooking() {
    this.bookingUpdateForm.reset();
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
    this.isSubmitDisabled = true;
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showUpdateSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Cập nhật lịch đặt thành công!` });
  }

  showUpdateFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật lịch đặt thất bại!' });
  }
}
