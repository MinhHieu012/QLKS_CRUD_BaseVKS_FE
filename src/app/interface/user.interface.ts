export interface User {
     username: String,
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