export interface Room {
     id: Number;
     name: String;
     roomNumber: String;
     floor: String;
     roomType: RoomTypeForDropdown;
     roomStatus: RoomStatus;
}

export interface RoomAdd {
     name: String;
     roomNumber: Number | String;
     floor: Number | String;
     roomTypeId: Number;
     description: String;
     price: Number | String;
}

export interface RoomUpdate {
     id: Number;
     name: String;
     roomNumber: Number | String;
     floor: Number | String;
     roomTypeId: Number;
     description: String;
     price: Number | String;
     status: String;
}

export interface RoomStatus {
     name: String;
     code: String;
}

export interface RoomTypeForDropdown {
     id: Number;
     name: String;
}