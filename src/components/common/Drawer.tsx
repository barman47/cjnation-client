'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { 
    HomeOutline, 
    AccountCircleOutline, 
    Menu as MenuIcon, 
    TrayArrowDown, 
    PencilOutline, 
    Logout, 
    ViewDashboard, 
    AccountGroupOutline, 
    NewspaperVariantOutline,
    Server
} from 'mdi-material-ui';
import {
    Avatar,
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
    Menu,
    MenuItem,
    Link as MuiLink,
    Toolbar,
    Tooltip,
    useMediaQuery
} from '@mui/material';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { CLOSED_DRAWER_WIDTH, OPEN_DRAWER_WIDTH, Role } from '@/utils/constants';
import { closeDrawer, selectIsDrawerOpen, setToast, toggleDrawer } from '@/redux/features/appSlice';
import { AppDispatch } from '@/redux/store';
import SearchBox from './SearchBox';
import { LIGHT_GREY, PRIMARY_COLOR, WHITE } from '@/app/theme';
import { logout, selectIsUserAuthenticated, selectUser } from '@/redux/features/authSlice';
import debounce from '@/utils/debounce';
import { getPostsByCategory, searchForApprovedPosts } from '@/redux/features/postsSlice';
import { selectCategory } from '@/redux/features/categoriesSlice';

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
    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start',
        gap: theme.spacing(2)
    }
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
    padding: theme.spacing(1, 0)
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

const AccountMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.secondary.main
}));

const LogoutMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main
}));

interface NavLink {
    icon: React.ReactElement;
    text: string;
    url: string;
}

const userLinks: NavLink[] = [
    {
        icon: <HomeOutline />,
        text: 'Home',
        url: '/'
    },
    {
        icon: <PencilOutline />,
        text: 'Write Post',
        url: '/dashboard/posts/create'
    },
    {
        icon: <TrayArrowDown />,
        text: 'Downloads',
        url: '/dashboard/downloads'
    },
    {
        icon: <AccountCircleOutline />,
        text: 'Account',
        url: '/dashboard/profile'
    },
];

const adminLinks: NavLink[] = [
    {
        icon: <ViewDashboard />,
        text: 'Dashboard',
        url: '/dashboard/admin/home'
    },
    {
        icon: <AccountGroupOutline />,
        text: 'User Management',
        url: '/dashboard/admin/users'
    },
    {
        icon: <NewspaperVariantOutline />,
        text: 'Blog Management',
        url: '/dashboard/admin/blogs'
    },
    {
        icon: <Server />,
        text: 'Downloads',
        url: '/dashboard/admin/downloads'
    },
];

interface Props {
    handleOpenSignInModal: () => void;
}

const AppDrawer: React.FC<Props> = ({ handleOpenSignInModal }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const pathname = usePathname();
    
    const category = useSelector(selectCategory);
    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const user = useSelector(selectUser);
    
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const open = useSelector(selectIsDrawerOpen);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    React.useEffect(() => {
        if (matches) {
            dispatch(closeDrawer());
        }
    }, [dispatch, matches]);

    const handleToggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' &&((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        dispatch(toggleDrawer());
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(setToast({
            type: 'success',
            message: 'Logged out successfully'
        }));
    };

    const handleSearch = (searchText: string) => {
        dispatch(searchForApprovedPosts(searchText));
    };

    const debouncedSearch = debounce(handleSearch, 1000);
    
    const handleSearchPosts = (searchText: string) => {
        const url = new URL(window.location.href);

        if (searchText) {
            url.searchParams.set('text', searchText);
            debouncedSearch(searchText);
        } else {
            url.searchParams.delete('text');
            dispatch(getPostsByCategory(category._id!));
        }
        window.history.pushState({}, '', url.toString());
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="header" position="fixed" open={matches ? false : open}>
                <DrawerToolBar>
                    <IconButton
                        color="secondary"
                        aria-label="open drawer"
                        onClick={handleToggleDrawer}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    {pathname === '/' && 
                        <SearchBox 
                            placeholder="Find what you are looking for"
                            searchHandler={handleSearchPosts}
                        />
                    }
                    {(!matches && !isAuthenticated) &&
                        <Box component="div">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ marginRight: 5 }}
                                LinkComponent={Link}
                                href="/dashboard/posts/create"
                            >
                                Start Writing
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={handleOpenSignInModal}
                            >
                                Log In
                            </Button>
                        </Box>
                    }
                    {isAuthenticated && 
                        <>
                            <Tooltip title="Account" arrow placement="top">
                                <IconButton
                                    onClick={handleOpenMenu}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: PRIMARY_COLOR }} src={user.avatar!} alt={user.name} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={menuOpen}
                                onClose={handleCloseMenu}
                                onClick={handleCloseMenu}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MuiLink component={Link} href="/dashboard/profile" underline="none">
                                    <AccountMenuItem onClick={handleCloseMenu}>
                                        <AccountCircleOutline /> &nbsp;Profile
                                    </AccountMenuItem>
                                </MuiLink>
                                
                                <Divider />

                                <LogoutMenuItem onClick={handleLogout}>
                                    <Logout /> &nbsp;Logout
                                </LogoutMenuItem>
                            </Menu>
                        </>
                    }
                </DrawerToolBar>
            </AppBar>
            {matches ?
                <MuiDrawer
                    anchor="left"
                    open={open}
                    onClose={handleToggleDrawer}
                >
                    <DrawerHeader>
                    {/* <IconButton onClick={handleToggleDrawer}>
                        {!open && <ChevronRight /> }
                    </IconButton> */}
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {userLinks.map((item: NavLink) => (
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
                                            mr: 3,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider />
                        {user.role === Role.ADMIN && 
                            <>
                                {adminLinks.map((item: NavLink) => (
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
                                                    mr: 3,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </>
                        }
                        {!isAuthenticated && 
                            <>
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        LinkComponent={Link}
                                        href="/"
                                        fullWidth
                                    >
                                            Start Writing
                                        </Button>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        onClick={() => {
                                            dispatch(closeDrawer());
                                            handleOpenSignInModal();
                                        }}
                                        fullWidth
                                    >
                                        Log In
                                    </Button>
                                </ListItem>
                            </>
                        }
                    </List>
                </MuiDrawer>
                :
                <Drawer variant={matches ? 'temporary' : 'permanent'} open={open} anchor="left">
                    <DrawerHeader>
                    {/* <IconButton onClick={handleToggleDrawer}>
                        {!open && <ChevronRight /> }
                    </IconButton> */}
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {userLinks.map((item: NavLink) => (
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
                        <Divider />
                        {user.role === Role.ADMIN && 
                            <>
                                {adminLinks.map((item: NavLink) => (
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
                            </>
                        }
                    </List>
                </Drawer>
            }
        </Box>
    );
}

export default AppDrawer;