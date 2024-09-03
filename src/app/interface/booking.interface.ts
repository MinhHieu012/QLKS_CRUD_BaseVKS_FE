import { Room } from "./room.interface";
import { User } from "./user.interface";

export interface Booking {
     id: Number,
     room: Room,
     user: User,
     checkInDate: Date,
     checkoutDate: Date,
     status: String,
     deposit: Number,
     amount: Number
}

export interface GetBookingWithSearchPaging {
     limit: number,
     page: number,
     bookingId: string | number | boolean,
     roomName: string | number | boolean,
     userName: string | number | boolean,
     checkInDate: string | number | boolean | Date,
     checkoutDate: string | number | boolean | Date
}