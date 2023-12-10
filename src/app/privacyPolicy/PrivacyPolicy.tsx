'use client';

import {
    Box,
    Stack,
    Typography
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    title: {
        fontWeight: 700,
        marginBottom: theme.spacing(3)
    },

    heading: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginBottom: theme.spacing(1)
    }
}));

const PrivacyPolicy: React.FC<{}> = () => {
    const { classes } = useStyles();

    return (
        <Box component="main">
            <Typography variant="h4" className={classes.title}>Privacy Policy</Typography>
            <Stack direction="column" spacing={3}>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Introduction</Typography>
                    <Typography variant="body1">CJNationent.com respects your privacy and is committed to protecting it through our compliance with this Privacy Policy. This Privacy Policy outlines the types of information we may collect from you or that you may provide when you visit our website CJNationent.com and our practices for collecting, using, maintaining, protecting, and disclosing that information.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Information We Collect</Typography>
                    <Typography variant="body1">
                        We may collect several types of information from and about users of our Website, including:<br /> 
                        Personal information by which you may be personally identified, such as name, postal address, email address, or telephone number. Non-personal identification information, such as browser name, type of computer, and technical information about your means of connection to our Website, such as the operating system and the Internet service providers utilized.
                    </Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>How We Collect Information</Typography>
                    <Typography variant="body1">
                        We may collect information:<br />
                        Directly from you when you provide it to us. Automatically as you navigate through the site. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.
                    </Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>How We Use Your Information</Typography>
                    <Typography variant="body1">
                        We may use the information we collect from you to: <br />
                        Provide you with information or services that you request from us. Fulfil any other purpose for which you provide it. Carry out our obligations and enforce our rights arising from any contracts entered into between you and us.
                    </Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Disclosure of Your Information</Typography>
                    <Typography variant="body1">
                        We may disclose aggregated information about our users and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy: <br />
                        To our subsidiaries and affiliates. To contractors, service providers, and other third parties we use to support our business.
                    </Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Your Choices About Our Collection, Use, and Disclosure of Your Information</Typography>
                    <Typography variant="body1">You may opt-out of receiving promotional emails from us by following the instructions provided in those emails. You may set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. </Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Security of Your Information</Typography>
                    <Typography variant="body1">We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Changes to Our Privacy Policy</Typography>
                    <Typography variant="body1">We may update our Privacy Policy from time to time. If we make material changes to how we treat our users&#39; personal information, we will post the new privacy policy on this page.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Contact Information</Typography>
                    <Typography variant="body1">
                        To ask questions or comment about this Privacy Policy and our privacy practices, email us at <a href="mailto:contact@cjnationent.com" target="_blank">cjnationent</a> or call <a href="tel:+2348035010980" target="_blank">+2348035010980</a>
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default PrivacyPolicy;