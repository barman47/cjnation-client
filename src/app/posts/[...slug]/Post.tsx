'use client';

import * as React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Avatar,
    Box,
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import parse from 'html-react-parser';
import moment from 'moment';
import _ from 'lodash';
import { TwitterShareButton, FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import {  useRouter } from 'next/navigation';
import { ChatOutline, Facebook, HeartOutline, Link, Linkedin, TrayArrowUp, Twitter, Whatsapp } from 'mdi-material-ui';

import { Like, Post as PostData } from '@/interfaces';
import { DARK_GREY, OFF_BLACK } from '@/app/theme';
import { capitalize } from '@/utils/capitalize';
import { AppDispatch } from '@/redux/store';
import { addLike, clearError, removeLike, selectIsLikesLoading, selectLikesErrors, selectLikesMessage, setLikesMessage } from '@/redux/features/likesSlice';
import { setToast } from '@/redux/features/appSlice';
import { selectIsUserAuthenticated, selectUser } from '@/redux/features/authSlice';
import { userLikedPost } from '@/utils/userLikedPost';
import { ModalRef, PAGE_TITLE } from '@/utils/constants';
import SignInModal from '@/components/common/SignInModal';
import ForgotPasswordModal from '@/components/common/ForgotPasswordModal';
import SignUpModal from '@/components/common/SignUpModal';

const useStyles = makeStyles()((theme) => ({
    title: {
        fontWeight: 600
    },

    author: {
        color: OFF_BLACK,
        fontWeight: 600
    },

    info: {
        color: OFF_BLACK,
        fontWeight: 300
    },

    dot: {
        backgroundColor: DARK_GREY,
        borderRadius: '50%',
        width: '3px',
        height: '3px'
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        height: '60vh',
        objectFit: 'cover',
        objectPosition: 'center'
    }
}));

interface Props {
    post: PostData;
    likes: Like[];
}

const URL = window.location.href;

const Post: React.FC<Props> = ({ post, likes }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    
    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const loading = useSelector(selectIsLikesLoading);
    const msg = useSelector(selectLikesMessage);
    const likesError = useSelector(selectLikesErrors);
    const user = useSelector(selectUser);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const likedPost = (userLikedPost(likes, user._id!));

    const pageTitle = `${post.title} | ${PAGE_TITLE}`;
    const pageDescription = post.body.slice(0, 161);

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

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(likesError)) {
            dispatch(setToast({
                type: 'error',
                message: likesError.msg!
            }));
            dispatch(clearError());
        }
    }, [likesError, dispatch]);

    React.useEffect(() => {
        if (msg) {
            router.refresh();
            dispatch(setLikesMessage(null));
        }
    }, [dispatch, msg, router]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCopyLink = async (): Promise<void> => {
        await navigator.clipboard.writeText(URL);
        dispatch(setToast({
            type: 'success',
            message: 'Link copied!'
        }));
        handleClose();
    };

    return (
        <>
            <ForgotPasswordModal ref={forgotPasswordModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <SignInModal ref={signInModalRef} handleOpenForgotPasswordModal={handleOpenForgotPasswordModal} handleOpenSignUpModal={handleOpenSignUpModal} />
            <SignUpModal ref={signUpModalRef} handleOpenSignInModal={handleOpenSignInModal} />
            <Box component="section">
                <Stack direction="column" spacing={3}>
                    <Typography variant="h5" className={classes.title}>{post.title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Avatar />
                        <Stack direction="column">
                            <Typography variant="subtitle2" className={classes.author}>{typeof post.author === 'string' ? post.author : capitalize(post.author.name)}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2" className={classes.info}>{moment(post.createdAt).format('MMMM Do, YYYY')}</Typography>
                                <Box component="div" className={classes.dot}></Box>
                                <Typography variant="subtitle2" className={classes.info}>{post.readDuration} min read</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Image 
                        src={post.mediaUrl!}
                        alt="post title"
                        width={800}
                        height={1200}
                        className={classes.image}
                    />
                    {parse(post.body)}
                    <Stack direction="row" spacing={3}>
                        <Chip 
                            icon={<HeartOutline />} 
                            label={post.likes} 
                            onClick={() => {
                                if (!isAuthenticated) {
                                    handleOpenSignInModal();
                                    return dispatch(setToast({
                                        type: 'info',
                                        message: 'Kindly log in to like post'
                                    }));
                                }
                                if (likedPost) {
                                    dispatch(removeLike(post._id!));
                                } else {
                                    dispatch(addLike(post._id!));
                                }
                            }}
                            disabled={loading}
                            color={likedPost ? 'primary' : 'default'}
                        />
                        <Chip icon={<ChatOutline />} label={post.comments} />
                        <Chip icon={<TrayArrowUp />} label="Share" onClick={handleClick} />
                    </Stack>
                </Stack>
            </Box>
            <Paper sx={{ width: 320, maxWidth: '100%' }}>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuList>
                        <MenuItem onClick={handleCopyLink}>
                            <ListItemIcon>
                                <Link fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Copy Link</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                            <TwitterShareButton
                                url={URL}
                                title={pageTitle}
                                hashtags={['1234', '4567']}
                            >
                                <Stack direction="row" alignItems="center">
                                    <ListItemIcon>
                                        <Twitter fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText>Share on Twitter</ListItemText>
                                </Stack>
                            </TwitterShareButton>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <FacebookShareButton
                                url={URL}
                                hashtag="#facebook"
                            >
                                <Stack direction="row" alignItems="center">
                                    <ListItemIcon>
                                        <Facebook fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText>Share on Facebook</ListItemText>
                                </Stack>
                            </FacebookShareButton>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <LinkedinShareButton
                                url={URL}
                                title={pageTitle}
                                summary={pageDescription}
                                source="CJ Nation"
                            >
                                <Stack direction="row" alignItems="center">
                                    <ListItemIcon>
                                        <Linkedin fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText>Share on LinkedIn</ListItemText>
                                </Stack>
                            </LinkedinShareButton>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <WhatsappShareButton
                                url={URL}
                                title={pageTitle}
                            >
                                <Stack direction="row" alignItems="center">
                                    <ListItemIcon>
                                        <Whatsapp fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText>Share on Whatsapp</ListItemText>
                                </Stack>
                            </WhatsappShareButton>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Paper>
        </>
    );
};

export default Post;