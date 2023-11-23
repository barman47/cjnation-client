import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { UserRole, Role } from '../utils/constants';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
    avatarName?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    role: UserRole;
    emailVerified?: boolean;
    emailVerificationToken?: string | null;
    emailVerificationTokenExpiration?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    matchPassword(password: string): Promise<boolean>;
    generateEmailVerificationToken(): string;
    getResetPasswordToken(): string;
    getSignedJwtToken(): string;
}

const UserSchema = new Schema<User>({
    name: {
        type: String,
        uppercase: true,
        required: [true, 'Name is required!'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email address is required!'],
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address!'],
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [8, 'Password must be at least 8 characters long!'],
        select: false,
        trim: true
    },

    avatar: {
        type: String,
    },

    avatarName: {
        type: String,
    },

    role: {
        type: String,
        required: true,
        enum: [Role.ADMIN, Role.USER],
        uppercase: true,
        trim: true,
        default: Role.USER
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationToken: {
        type: String,
        select: false
    },

    emailVerificationTokenExpiration: {
        type: Date,
        select: false
    },

    resetPasswordToken: {
        type: String,
        select: false
    },

    resetPasswordExpire: {
        type: Date,
        select: false
    }
}, { timestamps: true });

// Encrypt user password using brcypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    // const secret: Secret = !;
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Generate email verification token and return
UserSchema.methods.generateEmailVerificationToken = function () {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPassword token field
    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Set expire
    this.emailVerificationTokenExpiration = Date.now() + 10 * 60 * 1000 // 10 minutes
    
    return verificationToken;
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPassword token field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    
    return resetToken;
}

UserSchema.index({'$**': 'text'});
export default model<User>('User', UserSchema);