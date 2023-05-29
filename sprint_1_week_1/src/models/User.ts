export type User = { 
    id: string,
    login: string,
    password: string,
    passwordSalt: string,
    email: string,
    createdAt: string,
    confirmationEmail: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type UserViewModel ={
    id: string,
    login: string,
    email: string,
    createdAt: string
}