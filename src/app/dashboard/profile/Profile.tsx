'use client';

import * as React from 'react';
import Link from 'next/link';
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
    ListItemText
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { selectUser } from '@/redux/features/authSlice';
import { PRIMARY_COLOR } from '@/app/theme';
import { ContentCut, DeleteForeverOutline, DeleteOutline, PencilOutline } from 'mdi-material-ui';
import { capitalize } from '@/utils/capitalize';
import ProfilePost from './ProfilePost';

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
    root: {

    }
}));

const Profile: React.FC<{}> = () => {
    const { classes } = useStyles();

    const user = useSelector(selectUser);

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
        <Box component="main">
            <Typography variant="h4" sx={{ fontWeight: 600 }}>Profile</Typography>
            <Stack direction="row" spacing={5} alignItems="center" component="section" mt={10}>
                <Avatar sx={{ width: 200, height: 200, backgroundColor: PRIMARY_COLOR }} src={user.avatar!} alt={user.name} />
                <Button
                    variant="text"
                    color="primary"
                    size="large"
                    startIcon={<PencilOutline />}
                >
                    Edit Profile
                </Button>
            </Stack>
            <Typography variant="h6" mt={3} sx={{ textTransform: 'capitalize' }}>{capitalize(user.name)}</Typography>

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
                        <ListItemIcon>
                            <DeleteOutline fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>Delete Post</ListItemText>
                    </MenuItem>
                </MenuList>
                </Menu>
            </Paper>
        </Box>
    );
};

export default Profile;