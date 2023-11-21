'use client';

import { DRAWER_WIDTH } from '@/utils/constants';
import { styled } from '@mui/material/styles';

interface Props {
	children: React.ReactElement;
}

const Section = styled('section')(({ theme }) => ({
    border: '5px solid red',
    flexGrow: 1,
    padding: theme.spacing(3),
    // marginLeft: DRAWER_WIDTH,
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
}));

const AppLayout: React.FC<Props> = ({ children }: Props) => {
	return (
        <Section>
            {children}
        </Section>
	);
};

export default AppLayout;
