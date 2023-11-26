'use client';

import { Box, Theme, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { selectIsDrawerOpen } from '@/redux/features/appSlice';
import { CLOSED_DRAWER_WIDTH, OPEN_DRAWER_WIDTH, TOKEN_VALUE } from '@/utils/constants';
import React from 'react';
import setAuthToken from '@/utils/setAuthToken';
import { getCurrentUser } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';

interface Props {
	children: React.ReactElement;
}

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(9),
        padding: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1.5)
        }
    },

    drawerOpen: {
        marginLeft: `${OPEN_DRAWER_WIDTH}px`,
        transition: theme.transitions.create('width', { // transition should match the closedMixin in components/common/Drawer
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    }, 
    
    drawerClose: {
        marginLeft: `${CLOSED_DRAWER_WIDTH}px`,
        transition: theme.transitions.create('width', { // transition should match the openedMixin in components/common/Drawer
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },

    rightMobileMargin: {
        marginLeft: '0 !important'
    }
}));

const AppLayout: React.FC<Props> = ({ children }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    
    const drawerOpen = useSelector(selectIsDrawerOpen);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const { classes, cx } = useStyles();

    React.useEffect(() => {
        const authToken = localStorage.getItem(TOKEN_VALUE);
        if (authToken) {
            setAuthToken(authToken);
            dispatch(getCurrentUser());
        }
    }, [dispatch]);

	return (
        <Box 
            component="div" 
            className={cx(classes.root, { [classes.drawerOpen]: drawerOpen, [classes.drawerClose]: !drawerOpen, [classes.rightMobileMargin]: matches })} 
        >
            {children}
        </Box>
	);
};

export default AppLayout;
