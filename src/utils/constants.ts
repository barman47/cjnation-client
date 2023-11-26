export const TITLE_LENGTH = 100;

export enum Categories {
    MOVIE = 'MOVIE',
    MUSIC = 'MUSIC',
    POST = 'POST'
}

export enum PostStatus {
    APPROVED = 'APPROVED',
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    REJECTED = 'REJECTED'
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export type UserRole = `${Role}`;

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