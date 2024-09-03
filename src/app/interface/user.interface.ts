export interface User {
     username: String,
     phone?: String,
     identificationNumber: String,
     dateOfBirth: Date,
     role: String,
     status: String
}

export interface UserAdd {
     username: String,
     email: String,
     password: String,
     phone: String,
     identificationNumber: String,
     dateOfBirth: Date,
}

export interface UserUpdate {
     id: String,
     username: String,
     email: String,
     phone: String,
     identificationNumber: String,
     dateOfBirth: String,
}

export interface GetUserWithSearchPaging {
     limit: number,
     page: number,
     username: string | number | boolean,
     phone: string | number | boolean,
     identificationNumber: string | number | boolean
}