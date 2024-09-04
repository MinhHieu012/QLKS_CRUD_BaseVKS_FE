import { Component, EventEmitter, Output } from '@angular/core';
import { BookingService } from '../../../../service/booking.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomForDropdownModal, UserForDropdownModal } from '../../../../interface/booking.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../../../../service/local-storage-service.service';
import { CommonComponent } from '../../../../utils/common.component';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styleUrl: './booking-add.component.css'
})
export class BookingAddComponent {
  constructor(
    private bookingService: BookingService,
    private commmonFunc: CommonComponent,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.bookingAddForm = this.formBuilder.group({
      roomId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      checkInDate: ['', [Validators.required]],
      checkoutDate: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.getAllRoomForDropdown();
    this.getAllUserForDropdown();
    this.bookingAddForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  bookingAddForm: FormGroup;
  isSubmitDisabled: boolean = true;

  @Output() callGetBookingBackAfterAddUpdate = new EventEmitter<String>();

  display: boolean = false;
  fieldErrors: any = {};
  errorMessage: String = '';

  roomForDropdown: RoomForDropdownModal[] = [];
  userForDropdown: UserForDropdownModal[] = [];

  showDialog() {
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

  handleAddBooking() {
    const checkInDate = this.bookingAddForm.get('checkInDate')?.value;
    const checkoutDate = this.bookingAddForm.get('checkoutDate')?.value;

    if (checkInDate) {
      this.bookingAddForm.patchValue({
        checkInDate: this.convertToISOStringWithoutOffset(new Date(checkInDate))
      });
    }

    if (checkoutDate) {
      this.bookingAddForm.patchValue({
        checkoutDate: this.convertToISOStringWithoutOffset(new Date(checkoutDate))
      });
    }

    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.bookingService.addBooking(this.bookingAddForm.value).subscribe({
        next: () => {
          this.display = false;
          this.callGetBookingBackAfterAddUpdate.emit();
          this.showAddSuccessNotification();
          this.clearModalDataAddBooking();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.fieldErrors = error.error.result;
            const fieldErrors = error.error.result;
            if (fieldErrors.bookingExists) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.bookingExists}` });
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
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      });
    }
  }

  clearModalDataAddBooking() {
    this.bookingAddForm.reset();
    this.isSubmitDisabled = true;
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Thêm lịch đặt thành công!` });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm lịch đặt thất bại!' });
  }
}
