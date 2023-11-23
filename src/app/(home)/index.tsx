import { Divider, Grid } from '@mui/material';

import Post from './Post';
import FeaturedPost from './FeaturedPost';

const Home:React.FC<{}> = () => {
    return (
        <>
            <Grid container direction="row" spacing={1}>
                <Grid item xs={12} lg={8}>
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                </Grid>
                <Grid item xs={12} lg={0.5}>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs={12} lg={3.5}>
                    <FeaturedPost />
                    <FeaturedPost />
                    <FeaturedPost />
                    <FeaturedPost />
                    <FeaturedPost />
                </Grid>
            </Grid>
        </>
    );
};

export default Home;