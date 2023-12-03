'use client';

import Link from 'next/link';
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

const TermsOfService: React.FC<{}> = () => {
    const { classes } = useStyles();

    return (
        <Box component="main">
            <Typography variant="h4" className={classes.title}>Terms of Service</Typography>
            <Stack direction="column" spacing={3}>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Acceptance of terms</Typography>
                    <Typography variant="body1">By accessing or using CJ Nation website <Link href="/">cjnationent.com</Link>, you agree to comply with and be bound by these Terms of Service.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Changes of Terms</Typography>
                    <Typography variant="body1">CJ Nation reserves the right to modify or revise these Terms of Service at any time. Your continued use of the Website following the posting of changes constitutes your acceptance of those changes.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Use of Website</Typography>
                    <Typography variant="body1">You agree to use the Website only for lawful purposes and in a way that does not infringe on the rights of, restrict, or inhibit anyone else&#39;s use and enjoyment of the Website.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>User Accounts</Typography>
                    <Typography variant="body1">If you create an account on the Website, you are responsible for maintaining the security of your account and for all activities that occur under your account.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Content</Typography>
                    <Typography variant="body1">All content on the Website, including but not limited to text, graphics, logos, images, and software, is the property of CJ Nation and is protected by copyright and other intellectual property laws.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Prohibited Conducts</Typography>
                    <Typography variant="body1">
                        You agree not to engage in any of the following activities: <br />
                        Violating laws or regulations. Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity. Transmitting any material that is unlawful, obscene, defamatory, threatening, harassing, abusive, slanderous, hateful, or embarrassing to any other person or entity. 7. Disclaimer of Warranties
                        The Website is provided &#34;as is&#34; without any representations or warranties, express or implied. CJ Nation makes no representations or warranties regarding the accuracy, completeness, or suitability of the information on the Website.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Limitation of Liability</Typography>
                    <Typography variant="body1">To the fullest extent permitted by applicable law, CJ Nation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Indemnity</Typography>
                    <Typography variant="body1">You agree to indemnify and hold CJ Nation harmless from any claim or demand, including reasonable attorneys&#39; fees, made by any third party due to or arising out of your use of the Website.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Governing Law</Typography>
                    <Typography variant="body1">These Terms of Service are governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles.</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h5" className={classes.heading}>Contact Information</Typography>
                    <Typography variant="body1">If you have any questions about these Terms of Service, please contact us at <a href="mailto:cjnationent.com"></a>cjnationent.com.</Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default TermsOfService;