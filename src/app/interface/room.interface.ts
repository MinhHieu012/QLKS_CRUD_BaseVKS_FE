export interface Room {
     id: Number;
     name: String;
     roomNumber: String;
     floor: String;
     roomType: RoomTypeForDropdown;
     roomStatus: RoomStatus;
}

export interface User {
     username: String,
     identificationNumber: String,
     dateOfBirth: Date,
     role: String,
     status: String
}

export interface RoomStatus {
     name: String;
}

export interface RoomTypeForDropdown {
     id: Number;
     name: String;
}