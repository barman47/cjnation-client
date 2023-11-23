'use client';

import { Box, Theme, useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { selectIsDrawerOpen } from '@/redux/features/appSlice';
import { CLOSED_DRAWER_WIDTH, OPEN_DRAWER_WIDTH } from '@/utils/constants';
import Categories from '@/components/common/Categories';

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
    const drawerOpen = useSelector(selectIsDrawerOpen);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const { classes, cx } = useStyles();

	return (
        <Box 
            component="div" 
            className={cx(classes.root, { [classes.drawerOpen]: drawerOpen, [classes.drawerClose]: !drawerOpen, [classes.rightMobileMargin]: matches })} 
        >
            <Categories />
            {children}
        </Box>
	);
};

export default AppLayout;
