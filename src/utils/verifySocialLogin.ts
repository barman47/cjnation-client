import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { Provider } from './constants';

// interface FacebookData {
//     email: string;
//     first_name: string;
//     last_name: string;
//     picture: {
//         data: { url: string; }
//     }
// }

interface SocialLoginResponse {
    email: string;
    name: string;
    avatar?: string | null;
}

// async function verifyFacebookLogin (accessToken: string): Promise<SocialLoginResponse> {
//     const response = await axios.get(`https://graph.facebook.com/v18.0/me?fields=email,last_name,first_name,picture&access_token=${accessToken}`);
//     const data: FacebookData = response.data;
//     const { email, first_name, last_name, picture } = data;
//     return {
//         email,
//         name: `${first_name} ${last_name}`,
//         avatar: picture.data.url ? picture.data.url : null
//     };
// }

async function verifyGoogleLogin (accessToken: string): Promise<SocialLoginResponse | null> {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
        return null;
    }

    const { email, given_name, family_name, picture }: TokenPayload = payload;

    return {
        email: email!,
        name: `${given_name} ${family_name}`,
        avatar: picture ? picture : null
    };
}

export const verifySocialLogin = async (accessToken: string, provider: Provider): Promise<SocialLoginResponse | null> => {
    switch (provider) {
        case Provider.GOOGLE:
            return await verifyGoogleLogin(accessToken);
        
        default:
            return null;

    }
}; 