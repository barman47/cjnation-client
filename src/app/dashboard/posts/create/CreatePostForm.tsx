'use client';

import * as React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField, 
    useTheme
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import TextEditor from '@/components/common/TextEditor';
import TextInput from '@/components/common/TextInput';
import { Categories, ModalRef, PostStatus, TITLE_LENGTH } from '@/utils/constants';
import { PostData, validateCreateDraft, validateCreatePost } from '@/utils/validation/posts';
import { AppDispatch } from '@/redux/store';
import { setToast } from '@/redux/features/appSlice';
import { selectIsUserAuthenticated, selectUser } from '@/redux/features/authSlice';
import { LIGHT_GREY } from '@/app/theme';
import { clearError, createDraft, createPost, editPost, removePostImage, saveDraft, selectIsPostLoading, selectPost, selectPostErrors, selectPostMessage, setPostMessage } from '@/redux/features/postsSlice';
import { clearCategoriesErrors, getCategoriesByType, selectCategoires, selectCategoryErrors } from '@/redux/features/categoriesSlice';
import { Category } from '@/interfaces';
import { getCategoryId } from '@/utils/getCategoryId';
import PostSuccessModal from '@/components/common/PostSuccessModal';
import { capitalize } from '@/utils/capitalize';
import AccountVerificationModal from '@/components/common/AccountVerificationModal';

const useStyles = makeStyles()((theme) => ({
    imageContainer: {
        width: '100%',
        height: '50vh',
        overflow: 'hidden'
    },

    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },

    removeImageButton: {
        color: theme.palette.error.main
    }
}));

let fetchAttempt = 1;

interface Props {
    edit?: boolean;
}

const CreatePostForm: React.FC<Props> = ({ edit }) => {
    const { classes } = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();

    const loading = useSelector(selectIsPostLoading);
    const msg = useSelector(selectPostMessage);
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsUserAuthenticated);
    const post = useSelector(selectPost);
    const postErrors = useSelector(selectPostErrors);
    const categories = useSelector(selectCategoires);
    const categoriesError = useSelector(selectCategoryErrors);

    const [category, setCategory] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer>('');
    const [image, setImage] = React.useState<File>('' as unknown as File);
    const [errors, setErrors] = React.useState({} as PostData);
    
    const accountVerificationModalRef = React.useRef<ModalRef | null>(null);
    const fileUploadRef = React.useRef<HTMLInputElement>(null);
    const postSuccessModalRef = React.useRef<ModalRef | null>(null);

    React.useEffect(() => {
        if (isAuthenticated && !user.emailVerified) {
            accountVerificationModalRef.current?.openModal();
        }
    }, [dispatch, isAuthenticated, user]);

    React.useEffect(() => {
        if (edit && !_.isEmpty(post)) {
            if (post.mediaUrl) {
                setImageSrc(post.mediaUrl);
            }
            setTitle(post.title);
            setBody(post.body);
            if (typeof post.category === 'string') {
                setCategory(capitalize(post.category));
            } else {
                setCategory(capitalize(post.category.name));
            }
        }
    }, [edit, post]);
    

    React.useEffect(() => {
        dispatch(getCategoriesByType(Categories.POST));
    }, [dispatch]);

    // Refetch categories if it fails
    React.useEffect(() => {
        if (!_.isEmpty(categoriesError) && categories.length === 0 && fetchAttempt < 5) {
            fetchAttempt ++;
            dispatch(clearCategoriesErrors());
            dispatch(getCategoriesByType(Categories.POST));
        }
    }, [categoriesError, categories?.length, dispatch]);

    // Handle API error response
    React.useEffect(() => {
        if (!_.isEmpty(postErrors)) {
            setErrors(postErrors);
            dispatch(setToast({
                type: 'error',
                message: postErrors.msg!
            }));
        }
    }, [postErrors, dispatch]);

    React.useEffect(() => {
        if (!_.isEmpty(errors)) {
            dispatch(clearError());
        }
    }, [dispatch, errors]);

    React.useEffect(() => {
        if (msg) {
            // Show post success modal here
            postSuccessModalRef.current?.openModal();
            postSuccessModalRef.current?.setModalText(msg);
            dispatch(setPostMessage(null));
        }
    }, [dispatch, msg]);

    const handleChangeBody = (text: string): void => {
        setBody(text);
    };

    const handleSelectImage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        fileUploadRef.current?.click();
    };

    const handleRemovePhoto = () => {
        if (post.mediaUrl) {
            dispatch(removePostImage({ postId: post._id!, mediaName: post.mediaName! }));
        }
        setImage('' as unknown as File);
        setImageSrc('');
    };

    const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        setImage(files![0]);
        const reader = new FileReader();

        reader.onload = (() => {
            setImageSrc(reader.result!);
        });
        reader.readAsDataURL(files![0]);
    };

    const handleCreateDraft = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setErrors({} as PostData);

        const { errors, isValid } = validateCreateDraft({ title, body });
        if (!isValid) {
                dispatch(setToast({
                type: 'error',
                message: 'Invalid post Data!'
            }));
            return setErrors({ ...errors});
        }

        if (!user.emailVerified) {
            return accountVerificationModalRef.current?.openModal();
        }

        const data = new FormData();
        data.append('title', title);
        data.append('body', body);
        data.append('category', getCategoryId(category, categories));
        if (image) {
            data.append('image', image);
        }

        if (edit) {
            return handleSaveDraft(data);
        }
        dispatch(createDraft(data));
    };

    const handleCreatePost = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setErrors({} as PostData);

        const { errors, isValid } = validateCreatePost({ 
            category,
            title,
            body,
            author: user._id!,
            mediaUrl: imageSrc ? 'value exists' : '',

        });
        if (!isValid) {
                dispatch(setToast({
                type: 'error',
                message: 'Invalid post Data!'
            }));
            return setErrors({ ...errors});
        }

        if (!user.emailVerified) {
            return accountVerificationModalRef.current?.openModal();
        }

        const data = new FormData();
        data.append('title', title);
        data.append('body', body);
        data.append('category', getCategoryId(category, categories));
        data.append('author', user._id!);
        data.append('image', image);

        if (edit) {
            return handleEditPost(data);
        }
        dispatch(createPost(data));
    };

    const handleEditPost = (data: FormData): void => {
        data.append('status', PostStatus.PUBLISHED);
        dispatch(editPost({ post: data, postId: post._id! }));
    };

    const handleSaveDraft = (draft: FormData): void => {
        dispatch(saveDraft({ draft, postId: post._id! }));
    };

    return (
        <>
            <PostSuccessModal ref={postSuccessModalRef} />
            <AccountVerificationModal ref={accountVerificationModalRef} />
            <form>
                <Stack direction="column" spacing={3}>
                    <FormControl>
                        <Select
                            value={category}
                            onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
                            fullWidth
                            variant="outlined"
                            displayEmpty
                            error={errors.category ? true : false}
                            disabled={loading}
                        >
                            <MenuItem value="" disabled selected>Choose a category</MenuItem>
                            {categories?.length > 0 && categories.map((category: Category) => (
                                <MenuItem key={category._id} value={capitalize(category.name)}>{capitalize(category.name)}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ color: '#d32f2f' }}>{typeof errors.category === 'string' ? errors.category : ''}</FormHelperText>
                    </FormControl>
                    <TextInput 
                        input={
                            <TextField 
                                type="text"
                                placeholder="Enter Title"
                                variant="outlined"
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                fullWidth
                                helperText={errors.title}
                                error={errors.title ? true : false}
                                disabled={loading}
                                inputProps={{
                                    maxLength: TITLE_LENGTH
                                }}
                            />
                        }
                        secondaryElement={
                            <FormHelperText>{title.length}/{TITLE_LENGTH} Characters</FormHelperText>
                        }
                    />
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={handleSelectImage}
                            disabled={loading}
                        >
                            Select Image
                        </Button>
                        {imageSrc ?
                            <Button
                                size="large"
                                variant="outlined"
                                color="error"
                                onClick={handleRemovePhoto}
                                classes={{ root: classes.removeImageButton }}
                                disabled={loading}
                            >
                                Remove Image
                            </Button>
                            :
                            <FormHelperText sx={{ color: errors.mediaUrl ? theme.palette.error.main : theme.palette.grey[800] }}>{errors.mediaUrl || 'Provie an image for your post. File limit 10MB'}</FormHelperText>
                        }
                    </Stack>
                    <input
                        ref={fileUploadRef}
                        accept=".png, .jpg, .webm"
                        style={{ display: 'none' }}
                        onChange={handleSetImage}
                        type="file"
                    />
                    {imageSrc && 
                        <Box component="div" className={classes.imageContainer}>
                            <Image 
                                src={imageSrc.toString()}
                                alt="Post Image"
                                width={1000}
                                height={400}
                                className={classes.image}
                            />
                        </Box>
                    }
                    <TextEditor 
                        value={body} 
                        onChange={handleChangeBody} 
                        placeholder="Start typing here . . ."
                        borderColor={errors.body ? theme.palette.error.main : LIGHT_GREY}
                    />
                    {errors.body && <FormHelperText sx={{ color: theme.palette.error.main }}>{errors.body}</FormHelperText>}
                    <Divider />
                    <Stack direction="row" spacing={3}>
                        <Button
                            size="large"
                            variant="outlined"
                            color="secondary"
                            onClick={handleCreateDraft}
                            type="submit"
                            disabled={loading}
                        >
                            Save to Draft
                        </Button>
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            onClick={handleCreatePost}
                            type="submit"
                            disabled={loading}
                        >
                            Send for Approval
                        </Button>
                    </Stack>
                    <Divider />
                </Stack>
            </form>
        </>
    );
};

export default CreatePostForm;