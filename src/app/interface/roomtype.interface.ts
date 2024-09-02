export interface RoomType {
     id: Number;
     name: String;
     maxPeople: Number;
     description: String;
}

export interface RoomTypeAddUpdate {
     id?: Number | String;
     name: String;
     maxPeople: Number | String;
     description: String;
}

export interface GetRoomTypeWithSearchPaging {
     limit: number,
     page: number,
     name: string | number | boolean,
     maxPeople: string | number | boolean
}