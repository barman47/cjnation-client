'use client';

import * as React from 'react';

import Drawer from './Drawer';
import SignUpModal from './SignUpModal';
import { ModalRef } from '@/utils/constants';
import SignInModal from './SignInModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const Header: React.FC<{}> = () => {
    const forgotPasswordModalRef = React.useRef<ModalRef | null>(null);
    const signInModalRef = React.useRef<ModalRef | null>(null);
    const signUpModalRef = React.useRef<ModalRef | null>(null);

    const handleOpenForgotPasswordModal = ():void => {
        forgotPasswordModalRef.current?.openModal();
    };

    const handleOpenSignUpModal = ():void => {
        signUpModalRef.current?.openModal();
    };

    const handleOpenSignInModal = ():void => {
        signInModalRef.current?.openModal();
    };
    
    return (
        <div>
            <ForgotPasswordModal ref={forgotPasswordModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <SignInModal ref={signInModalRef} handleOpenForgotPasswordModal={handleOpenForgotPasswordModal} handleOpenSignUpModal={handleOpenSignUpModal} />
            <SignUpModal ref={signUpModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <Drawer handleOpenSignInModal={handleOpenSignInModal} />
        </div>
    );
};

export default Header;