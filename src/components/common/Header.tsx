'use client';

import * as React from 'react';

import Drawer from './Drawer';
import SignUpModal from './SignUpModal';
import { ModalRef } from '@/utils/constants';
import SignInModal from './SignInModal';

const Header: React.FC<{}> = () => {

    const signInModalRef = React.useRef<ModalRef | null>(null);
    const signUpModalRef = React.useRef<ModalRef | null>(null);

    const handleOpenSignUpModal = ():void => {
        signUpModalRef.current?.openModal();
    };

    const handleOpenSignInModal = ():void => {
        signInModalRef.current?.openModal();
    };
    
    return (
        <div>
            <SignInModal ref={signInModalRef} handleOpenSignUpModal={handleOpenSignUpModal} />
            <SignUpModal ref={signUpModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <Drawer handleOpenSignInModal={handleOpenSignInModal} handleOpenSignUpModal={handleOpenSignUpModal} />
        </div>
    );
};

export default Header;