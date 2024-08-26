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
     phone: Number,
     identificationNumber: String,
     dateOfBirth: Date,
}