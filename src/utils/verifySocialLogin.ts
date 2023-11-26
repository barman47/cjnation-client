import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { Provider } from './constants';

interface SocialLoginResponse {
    email: string;
    name: string;
    avatar?: string | null;
}

async function verifyGoogleLogin (accessToken: string): Promise<SocialLoginResponse | null> {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID
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