'use client';

import * as React from 'react';
import {
    Box,
    Button, 
    Modal,
    Stack,
    Theme,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';

import { WHITE } from '@/app/theme';
import { ModalRef } from '@/utils/constants';
import { CheckCircle } from 'mdi-material-ui';

import Link from 'next/link';

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        backgroundColor: WHITE,
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        padding: theme.spacing(2),
        transform: 'translate(-50%, -50%)',
        width: theme.spacing(55),

        [theme.breakpoints.down('sm')]: {
            width: '85%'
        }
    },

    iconContainer: {
        backgroundColor: '#2AA85E1A',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: theme.spacing(10),
        width: theme.spacing(10)
    },

    icon: {
        color: theme.palette.success.main,
        fontSize: theme.spacing(6)
    }
}));

interface Props {
    ref: any;
}

const PostSuccessModal: React.FC<Props> = React.forwardRef<ModalRef, Props>((_props: Props, ref: any) => {
    const { classes } = useStyles();

    const [text, setText] = React.useState('');
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = React.useCallback(() => {
        setOpen(false)
    }, []);

    React.useImperativeHandle(ref, () => ({
        openModal: () => {
            handleOpen();
        },

        closeModal: () => {
            handleClose();
        },

        setModalText: (text: string) => {
            setText(text);
        }
    }));
  
    return (
        <Modal
            open={open}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown
        >
            <Box component="section" className={classes.root}>
                <Stack direction="column" alignItems="center" spacing={3}>
                    <Box component="div" className={classes.iconContainer}>
                        <CheckCircle className={classes.icon} />
                    </Box>
                    <Typography variant="h5">Success</Typography>                        
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>{text}</Typography>                        
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        LinkComponent={Link}
                        href="/"
                        fullWidth
                    >
                        Return Home
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
});

PostSuccessModal.displayName = 'PostSuccessModal';

export default PostSuccessModal;