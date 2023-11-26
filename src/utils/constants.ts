export const OPEN_DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 70;
export const TOKEN_VALUE = 'cjnationAuthToken';
export const PAGE_TITLE = 'CJNation Entertainment';
export const TITLE_LENGTH = 100;

export interface ApiResponse {
    success: boolean;
    data: any;
    msg?: string;
    token?: string;
    statusCode: number;
}

export interface UserUpdateData {
    data: FormData;
    _id: string;
    msg?: string;
}

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

export interface Error {
    msg?: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum Provider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE'
}

export interface SocialLoginData {
    accessToken: string;
    provider: Provider;
}

export type ApiErrorResponse = Omit<ApiResponse, 'token'>;

export interface ModalRef {
    openModal: () => void;
    closeModal: () => void;
    setModalText: (text: string) => void;
}

export interface ErrorObject<T> {
    errors: T;
    isValid: boolean;
};