import { Error, Role } from '@/utils/constants';

export interface User extends Error {
    _id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
    avatarName?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    role: Role;
    emailVerified?: boolean;
}