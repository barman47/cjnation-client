export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export type UserRole = `${Role}`;

export enum PostStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export enum Provider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE'
}

export interface ServerResponse {
    statusCode: number | 200;
    success: boolean;
    data?: unknown;
    msg?: string;
    count?: number;
    errors?: unknown;
}

export interface ErrorObject<T> {
    errors: T;
    isValid: boolean;
};