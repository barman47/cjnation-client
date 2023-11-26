'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { 
    Box, 
    Typography,
    Theme,
    Avatar,
    Button,
    Stack,
    Tabs,
    Tab,
    Paper,
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { selectUser } from '@/redux/features/authSlice';
import { PRIMARY_COLOR } from '@/app/theme';
import { ContentCut, DeleteOutline, PencilOutline } from 'mdi-material-ui';
import { capitalize } from '@/utils/capitalize';
import ProfilePost from './ProfilePost';
import ProfileUpdateModal from './ProfileUpdateModal';
import { ModalRef } from '@/utils/constants';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


const useStyles = makeStyles()((theme: Theme) => ({
    title: {
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    avatar: {
        backgroundColor: PRIMARY_COLOR,
        fontSize: theme.spacing(10),
        height: theme.spacing(25), 
        width: theme.spacing(25), 

        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(15), 
            height: theme.spacing(15), 
        }
    },

    name: {
        textTransform: 'capitalize',

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    }
}));

const Profile: React.FC<{}> = () => {
    const { classes } = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const user = useSelector(selectUser);

    const [value, setValue] = React.useState(0);

    const profileUpdateModalRef = React.useRef<ModalRef | null>(null);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ProfileUpdateModal ref={profileUpdateModalRef} />
            <Box component="main">
                <Typography variant="h4" className={classes.title}>Profile</Typography>
                <Stack direction={matches ? 'column' : 'row'} spacing={ matches ? 2 : 5} alignItems="center" component="section" mt={matches ? 2 : 6}>
                    <Avatar 
                        className={classes.avatar}
                        src={user.avatar!}
                        alt={user.name} 
                    />
                    <Button
                        variant="text"
                        color="primary"
                        size="large"
                        startIcon={<PencilOutline />}
                        onClick={() => profileUpdateModalRef.current?.openModal()}
                    >
                        Edit Profile
                    </Button>
                </Stack>

                <Typography variant="h6" mt={3} className={classes.name}>{capitalize(user.name)}</Typography>

                <Box>
                    <Tabs 
                        value={value} 
                        textColor="primary" 
                        indicatorColor="primary" 
                        onChange={handleChange} 
                        aria-label="post-tabs"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab sx={{ textTransform: 'none' }} label="Blog Posts" disableRipple disableFocusRipple {...a11yProps(0)} />
                        <Tab sx={{ textTransform: 'none' }} label="Drafts" disableRipple disableFocusRipple {...a11yProps(1)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        <ProfilePost
                            title="Doing business in the 21st Century: Adaptation and Innovation"
                            createdAt="8 days ago"
                            handleClick={handleClick}
                        />
                        <ProfilePost
                            title="Doing business in the 21st Century: Adaptation and Innovation"
                            createdAt="8 days ago"
                            handleClick={handleClick}
                        />
                        <ProfilePost
                            title="Doing business in the 21st Century: Adaptation and Innovation"
                            createdAt="8 days ago"
                            handleClick={handleClick}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <ProfilePost
                            title="Doing business in the 21st Century: Adaptation and Innovation"
                            createdAt="8 days ago"
                            handleClick={handleClick}
                        />
                        <ProfilePost
                            title="Doing business in the 21st Century: Adaptation and Innovation"
                            createdAt="8 days ago"
                            handleClick={handleClick}
                        />
                    </CustomTabPanel>
                </Box>
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                    <MenuList>
                        <MenuItem>
                            <ListItemIcon>
                                <ContentCut fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Edit Post</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon sx={{ color: theme.palette.error.main }}>
                                <DeleteOutline fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: theme.palette.error.main }}>Delete Post</ListItemText>
                        </MenuItem>
                    </MenuList>
                    </Menu>
                </Paper>
            </Box>
        </>
    );
};

export default Profile;