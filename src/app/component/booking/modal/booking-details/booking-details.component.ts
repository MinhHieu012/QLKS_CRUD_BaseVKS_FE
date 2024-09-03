import { Component, Input } from '@angular/core';
import { BookingService } from '../../../../service/booking.service';
import { Booking } from '../../../../interface/booking.interface';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {
  constructor(
    private bookingService: BookingService
  ) { }

  bookingDetail: Booking[] = [];
  visible: boolean = false;

  @Input() bookingIdFromParent: Number = 0;

  openDetailBooking() {
    this.bookingService.getBookingById(this.bookingIdFromParent).subscribe((data: any) => {
      this.bookingDetail = [data.result];
      this.visible = true;
    });   
  }
}
