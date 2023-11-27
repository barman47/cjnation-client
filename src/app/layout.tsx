import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ThemeRegistry from './ThemeRegistry';
import Header from '@/components/common/Header';
import AppLayout from './AppLayout';
import { Providers } from '@/redux/Provider';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './globals.css'
import { PAGE_TITLE } from '@/utils/constants';

export const metadata: Metadata = {
    title: `Home | ${PAGE_TITLE}`
};

interface Props {
	children: React.ReactElement;
	params: { id: string };
}

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  	children
}: Props) {
	return (
		<html lang="en">
			<head>
				{/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" /> */}
			</head>
			<body className={inter.className}>
				<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
					<Providers>
						<ThemeRegistry options={{ key: 'mui' }}>
							<Header />
							<AppLayout>
								{children}
							</AppLayout>
						</ThemeRegistry>
					</Providers>
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
