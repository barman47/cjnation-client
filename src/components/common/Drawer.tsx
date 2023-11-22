'use client';

import * as React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { Menu, HomeOutline, AccountCircleOutline, TrayArrowDown, PencilOutline } from 'mdi-material-ui';
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useMediaQuery
} from '@mui/material';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { CLOSED_DRAWER_WIDTH, OPEN_DRAWER_WIDTH } from '@/utils/constants';
import { selectIsDrawerOpen, toggleDrawer } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import SearchBox from './SearchBox';
import { LIGHT_GREY, WHITE } from '@/app/theme';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const openedMixin = (theme: Theme): CSSObject => ({
    width: OPEN_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
        width: `${CLOSED_DRAWER_WIDTH}px`,
    },
    // width: `calc(${theme.spacing(7)} + 1px)`,
    // [theme.breakpoints.up('sm')]: {
    //     width: `calc(${theme.spacing(8)} + 1px)`,
    // },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DrawerToolBar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    ...(open && {
        marginLeft: OPEN_DRAWER_WIDTH,
        width: `calc(100% - ${OPEN_DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    backgroundColor: WHITE,
    borderBottom: `1px solid ${LIGHT_GREY}`,
    boxShadow: 'none',
    // padding: theme.spacing(1, 0)
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: OPEN_DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    })})
);

interface HomeLink {
    icon: React.ReactElement;
    text: string;
    url: string;
}

const links: HomeLink[] = [
    {
        icon: <HomeOutline />,
        text: 'Home',
        url: '/'
    },
    {
        icon: <PencilOutline />,
        text: 'Write Post',
        url: '/'
    },
    {
        icon: <TrayArrowDown />,
        text: 'Downloads',
        url: '/'
    },
    {
        icon: <AccountCircleOutline />,
        text: 'Account',
        url: '/'
    },
];

export default function MiniDrawer() {
    const dispatch: AppDispatch = useDispatch();
    
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const open = useSelector(selectIsDrawerOpen);

    const handleToggleDrawer = () => {
        dispatch(toggleDrawer());
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="header" position="fixed" open={open}>
                <DrawerToolBar>
                    <IconButton
                        color="secondary"
                        aria-label="open drawer"
                        onClick={handleToggleDrawer}
                        edge="start"
                        sx={{
                            marginRight: theme.spacing(5),
                        }}
                    >
                        <Menu />
                    </IconButton>
                    <SearchBox 
                        placeholder="Find what you are looking for"
                    />
                    <Box component="div">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ marginRight: 5 }}
                            LinkComponent={Link}
                            href="/"
                        >
                            Start Writing
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            LinkComponent={Link}
                            href="/auth/login"
                        >
                            Log In
                        </Button>
                    </Box>  
                </DrawerToolBar>
            </AppBar>
            <Drawer variant={matches ? 'temporary' : 'permanent'} open={open}>
                <DrawerHeader>
                {/* <IconButton onClick={handleToggleDrawer}>
                    {!open && <ChevronRight /> }
                </IconButton> */}
                </DrawerHeader>
                <Divider />
                <List>
                    {links.map((item: HomeLink) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                LinkComponent={Link}
                                href={item.url}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}