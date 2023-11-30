import { get, post, controller, patch, use } from './decorators';
import { Request, Response } from 'express';
import crypto from 'crypto';
import Validator from 'validator';
import mongoose from 'mongoose';

import { 
    LoginData, 
    validateLoginUser, 
    validateRegisterUser,
    validateResetPassword,
    ResetData,
    UserRegistrationData
} from '../utils/validation/auth';
import UserModel from '../models/User';
import { ErrorObject, Role } from '../utils/constants';
import { sendServerResponse } from '../utils/sendServerResponse';
import { returnError } from '../utils/returnError';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import { protect } from '../utils/auth';
import { sendEmail } from '../utils/sendEmail';
import { deleteFile, uploadFile } from '../utils/googleCloudStorage';
import { verifySocialLogin } from '../utils/verifySocialLogin';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';
import { isEmpty } from '../utils/isEmpty';

@controller('/auth')
export class AuthController {
    // Login existing user
    @post('/login')
    async login(req: Request, res: Response) {
        try {
            const { errors, isValid }: ErrorObject<LoginData> = validateLoginUser(req.body);
            const email = req.body.email.toLowerCase();
    
            if (!isValid) {
                return sendServerResponse(res, { 
                    statusCode: 400,
                    success: false, 
                    errors, 
                    msg: 'Invalid login details' 
                });
            }
    
            let user = await UserModel.findOne({ email }).select('+password');
    
            if (!user) {
                return sendServerResponse(res, { 
                    statusCode: 401,
                    success: false, 
                    errors: { email: 'Invalid email or password!', password: 'Invalid email or password!' }, 
                    msg: 'Invalid Login Credentials!' 
                });
            }
    
            // Check if password matches
            const isMatch = await user.matchPassword(req.body.password);
    
            if (!isMatch) {
                return sendServerResponse(res, { 
                    statusCode: 401, 
                    success: false,
                    errors: { email: 'Invalid email or password!', password: 'Invalid email or password!' }, 
                    msg: 'Invalid Login Credentials!' 
                });
            }

            if (!user.emailVerified) {
                // Get verification token
                const verificationToken = user.generateEmailVerificationToken();
        
                // Create verification url
                const origin = req.headers.origin;
                const verificationUrl = `${origin}/auth/emailVerification?token=${verificationToken}`;
                const message = `Click the <a href="${verificationUrl}" target="_blank">Verify Account</a> link to verify your account.`;
        
                await Promise.all([
                    user.save({ validateBeforeSave: false }),
                    sendEmail({
                        to: user.email,
                        subject: 'Account Verification',
                        html: message
                    })
                ]);

                if (process.env.NODE_ENV === 'test') { // return verification token in test mode only
                    return sendServerResponse(res, { 
                        statusCode: 201, 
                        success: true, 
                        data: { verificationToken },  
                        msg: `Account not verified. We have sent a verification link to ${email}. Kindly click the link in the email to verify your account.`
                    });       
                }

                return sendServerResponse(res, { 
                    statusCode: 201, 
                    success: true, 
                    data: { },  
                    msg: `Account not verified. We have sent a verification link to ${email}. Kindly click the link in the email to verify your account.`
                });
            }

            return sendTokenResponse(user, 200, 'Login successful', res);
        } catch (err) {
            return returnError(err, res, 500, 'Login failed');
        }
    }

    // Register new user
    @post('/register')
    async register(req: Request, res: Response) {
        try {
            const { isValid, errors }: ErrorObject<UserRegistrationData> = validateRegisterUser(req.body);
            
            if (!isValid) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors,
                    msg: 'Invalid user data!'
                });
            }
            
            const userExists = await UserModel.exists({ email: req.body.email.toLowerCase() });
            if (userExists) {
                return sendServerResponse(res, { 
                    statusCode: 401, 
                    success: false, 
                    errors: { },
                    msg: 'User already registered! Please login instead.'
                });
            }
            
            const user = await UserModel.create(req.body);

            // Get verification token
            const verificationToken = user.generateEmailVerificationToken();
        
            // Create verification url
            const origin = req.headers.origin;
            const verificationUrl = `${origin}/auth/emailVerification?token=${verificationToken}`;
            const message = `Click the <a href="${verificationUrl}" target="_blank">Verify Account</a> link to verify your account.`;

            await Promise.all([
                user.save({ validateBeforeSave: false }),
                sendEmail({
                    to: user.email,
                    subject: 'Account Verification',
                    html: message
                })
            ]);
            user.set('emailVerificationToken', undefined);
            user.set('emailVerificationTokenExpiration', undefined);

            return sendTokenResponse(user, 201, `User created successfully`, res);
        } catch (err) {
            return returnError(err, res, 500, 'Unable to register user');
        }
    }

    @post('/socialLogin')
    async socialLogin (req: Request, res: Response) {
        try {
            const userData = await verifySocialLogin(req.body.accessToken, req.body.provider);
            if (!userData) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors: { },
                    msg: 'Invalid login request!'
                });
            }

            const user = await UserModel.findOne({ email: userData.email });

            if (!user) {
                const newUser = await UserModel.create({ ...userData, role: Role.USER, password: new mongoose.Types.ObjectId(), emailVerified: true });
                return sendTokenResponse(newUser, 201, `${newUser.role} created successfully`, res);
            }

            return sendTokenResponse(user, 200, 'Login successful', res);
        } catch (err) {
            return returnError(err, res, 500, 'Failed to verify user login');   
        }
    }

    @get('/emailVerification/:token')
    async verifyUserEmail (req: Request, res: Response) {
        try {
            const emailVerificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            const user = await UserModel.findOne({
                emailVerificationToken,
                emailVerificationTokenExpiration:  { $gt: new Date() }
            });

            if (!user) {
                return sendServerResponse(res, { 
                    statusCode: 401, 
                    success: false, 
                    errors: { },
                    msg: 'Email verification link has expired.'
                });
            }

            user.emailVerified = true;
            user.set('emailVerificationToken', undefined);
            user.set('emailVerificationTokenExpiration', undefined);

            const verifiedUser = await user.save();

            return sendTokenResponse(verifiedUser, 200, `Email verified successfully`, res);
        } catch (err) {
            return returnError(err, res, 500, 'Failed to verify user account');
        }
    }

    // Update user by ID: This will work for every single user
    @use(protect)
    @patch('/updateProfile/:id')
    async updateUser(req: Request, res: Response) {
        try {
            const file = req.files?.image;
            const { name } = req.body;

            if (isEmpty(name)) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors: { name: 'Your name is required!' },
                    msg: 'Invalid profile data!',
                });
            }

            if (file) {
                const fileNameExtension = getFileNameExtension(file.name);
                let user = await UserModel.findById(req.user._id);

                if (!user) {
                    return sendServerResponse(res, { 
                        statusCode: 404, 
                        success: false, 
                        errors: { name: 'Your name is required!' },
                        msg: `User id ${req.user._id} is not defined`,
                    });
                }

                if (user?.avatarName) {
                    await deleteFile(user.avatarName);
                }

                const uploadResponse = await uploadFile(file.tempFilePath, `${process.env.AVATARS_FOLDER}/${user._id}.${fileNameExtension}`);
                user.avatar = uploadResponse.url;
                user.avatarName = uploadResponse.name;
                user.name = name;
                user = await user.save();

                return sendServerResponse(res, { 
                    statusCode: 200, 
                    success: true, 
                    data: user,
                    msg: 'User updated successfully'
                });
            }

            const user = await UserModel.findByIdAndUpdate(req.params.id, { $set: { name } }, { new: true, runValidators: true });

            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: user,
                msg: 'User updated successfully'
            });
        } catch(err) {
            return returnError(err, res, 500, 'Failed to update user');
        }
    }

    // Send password reset email
    @post('/forgotPassword')
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email || !Validator.isEmail(email)) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors: { email: 'Invalid email address!', },
                    msg: 'Invalid email address!'
                });
            }

            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                // Send 200 response even when user does not exist
                return sendServerResponse(res, { 
                    statusCode: 200, 
                    success: true, 
                    data: { },
                    msg: `We sent a password reset link to ${email}`,
                });
            }

            // Get reset token
            const resetToken = user.getResetPasswordToken();
    
            await user.save({ validateBeforeSave: false });
    
            // Create reset url
            const origin = req.headers.origin;
            const resetUrl = `${origin}/auth/resetPassword?token=${resetToken}`;
            const message = `It happens to the best of us. The good news is you can change it right now. Click the <a href="${resetUrl}" target="_blank">Reset Password</a> link to recover your password.`;
    
            await sendEmail({
                to: email,
                subject: 'Password Reset',
                html: message
            });

            // Return password reset token in test mode only
            if (process.env.NODE_ENV === 'test') {
                return sendServerResponse(res, { 
                    statusCode: 200, 
                    success: true, 
                    data: {  resetToken },
                    msg: `Password reset link has been sent to to this email ${email}`,
                });
            }
    
            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: { },
                msg: `Password reset link has been sent to to this email ${email}`,
            });
        } catch (err) {
            return returnError(err, res, 500, 'Unable to send password reset email');
        }
    }

    @patch('/resetPassword/:resetToken')
    async resetPassword(req: Request, res: Response) {
        try {
            const { errors, isValid }: ErrorObject<ResetData> = validateResetPassword(req.body);

            if (!isValid) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors,
                    msg: 'Invalid password data!',
                });
            }

            const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
            const user = await UserModel.findOne({
                resetPasswordToken,
                resetPasswordExpire:  { $gt: new Date() }
            });

            if (!user) {
                return sendServerResponse(res, { 
                    statusCode: 401, 
                    success: false, 
                    errors: { },
                    msg: 'Invalid token. Kindly use the forgot password page.'
                });
            }

            user.password = req.body.password;
            user.set('resetPasswordToken', undefined)
            user.set('resetPasswordExpire', undefined)
            await user.save();
            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: { },
                msg: 'Your password has been successfully reset. Please proceed to login'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Unable to reset password');
        }
    }

    @use(protect)
    @get('/')
    async getCurrentUser(req: Request, res: Response) {
        try {
            const user = await UserModel.findOne({ _id: req.user.id });
            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: user
            });
        } catch (err) {
            return returnError(err, res, 500, 'Unable to get current user');
        }
    }

    @use(protect)
    @patch('/deleteAvatar')
    async deleteAvatar (req: Request, res: Response) {
        try {
            // if (!req.body.fileName) {
            //     return sendServerResponse(res, { 
            //         statusCode: 400, 
            //         success: false, 
            //         errors: { fileName: 'File name is required!' },
            //         msg: 'Invalid delete data!',
            //     });
            // }
            if (req.body.fileName) {
                await deleteFile(req.body.fileName);
                const updatedUser = await UserModel.findOneAndUpdate({ _id: req.user._id }, { $unset: { avatar: 1, avatarName: 1 }}, { new: true } );

                return sendServerResponse(res, { 
                    statusCode: 200, 
                    success: true, 
                    data: updatedUser,
                    msg: 'Profile photo deleted successfully'
                });
            }

            const updatedUser = await UserModel.findOneAndUpdate({ _id: req.user._id }, { $unset: { avatar: 1, avatarName: 1 }}, { new: true } );

            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: updatedUser,
                msg: 'Profile photo deleted successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Unable to delete profile photo');
        }
    }

    @get('/logout')
    async logout(_req: Request, res: Response) {
        res.cookie(process.env.COOKIE!, 'none', {
            expires: new Date(Date.now() - 10 * 1000),
            httpOnly: true
        });
        return sendServerResponse(res, { 
            statusCode: 200, 
            success: true, 
            data: { },
            msg: 'User logged out successfully'
        });
    }
}