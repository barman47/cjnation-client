import * as React from 'react';

import Image from 'next/image';
import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ContentCopy, DeleteOutline, Pause, PencilOutline, Play } from 'mdi-material-ui';

import image from '../../../../../public/assets/avatar.jpeg';

const useStyles = makeStyles()((theme => ({
    cover: {
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover',
        objectPosition: 'center',
        width: theme.spacing(10),
        height: theme.spacing(12)
    }
})));

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const MusicTable: React.FC<{}> = () => {
    const { classes } = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
           <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Cover</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Artiste</TableCell>
                            <TableCell align="center">Genre</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Image 
                                        src={image.src}
                                        width={80}
                                        height={100}
                                        alt="Thumbnail"
                                        className={classes.cover}
                                    />
                                </TableCell>
                                <TableCell align="center">Talk About it</TableCell>
                                <TableCell align="center">MI Abaga</TableCell>
                                <TableCell align="center">Rap</TableCell>
                                <TableCell>
                                    <Stack direction="row">
                                        {/* <IconButton>
                                            <Pause />
                                        </IconButton> */}
                                        <IconButton>
                                            <Play />
                                        </IconButton>
                                        <IconButton>
                                            <PencilOutline />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteOutline />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default MusicTable;