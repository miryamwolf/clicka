import { ID, DateISO } from '../../../shared-types';
import { User,UserRole } from '../../../shared-types';

// User model
export class UserModel implements User{
    id?: ID;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    googleId: string;
    lastLogin?: DateISO;
    active: boolean;
    createdAt: DateISO;
    updatedAt: DateISO;
    password?: string; // Optional, if you want to store password hash

    constructor(data:{
        id: ID,
        email: string,
        firstName: string,
        lastName: string,
        role: UserRole, 
        googleId: string,
        active: boolean,
        createdAt: DateISO,
        updatedAt: DateISO,
        lastLogin?: DateISO,
        password?: string 
    }) {
        this.id = data.id || "";
        this.email = data.email;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.role = data.role;
        this.googleId = data.googleId;
        this.lastLogin = data.lastLogin;
        this.active = data.active;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.password = data.password || ''; 
    }
    // Convert the user model to a format suitable for database storage
    toDatabaseFormat() {
        return {
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            role: this.role,
            google_id: this.googleId,
            last_login: this.lastLogin,
            active: this.active,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            password: this.password ? this.password : undefined, // Optional field
        };
    }
    static fromDatabaseFormat(dbData: any): UserModel {
        return new UserModel({
            id: dbData.id,
            email: dbData.email,
            firstName: dbData.first_name, 
            lastName: dbData.last_name,
            role: dbData.role,
            googleId: dbData.google_id, 
            active: dbData.active,
            createdAt: dbData.created_at,
            updatedAt: dbData.updated_at,
            lastLogin: dbData.last_login,
            password: dbData.password, // Optional field
        });
    }
    static fromDatabaseFormatArray(dbDataArray: any[] ): UserModel[] {
        return dbDataArray.map(dbData => UserModel.fromDatabaseFormat(dbData));
    }
}