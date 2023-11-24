import { Metadata } from 'next';

import Home from './(home)';
import { PAGE_TITLE } from '@/utils/constants';

export const metadata: Metadata = {
    title: `Home | ${PAGE_TITLE}`
};

const HomePage: React.FC<{}> = () => {
	return (
		<Home />
	);
}

export default HomePage;
