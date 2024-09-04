import { Room } from "./room.interface";
import { User } from "./user.interface";

export interface Booking {
     id: Number,
     room: Room,
     user: User,
     checkInDate: Date,
     checkoutDate: Date,
     status: String,
     deposit: number | string,
     amount: Number
}

export interface BookingUpdate {
     id: Number | String,
     roomId: Number | String,
     userId: Number | String,
     checkInDate: Date | String,
     checkoutDate: Date | String,
     deposit: Number | String,
     amount: Number | String
     status: String,
}

export interface BookingStatus {
     name: String;
     code: String;
}

export interface RoomForDropdownModal {
     id: Number;
     roomNumber: Number;
}

export interface UserForDropdownModal {
     id: Number | String;
     username: String;
}

export interface BookingAdd {
     roomId: Number,
     userId: String | Number,
     checkInDate: Date,
     checkoutDate: Date,
     deposit?: Number,
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