'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { SignInButton } from './auth/AuthButtons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ジョジョのGoal Tracker
                    </Typography>
                    <SignInButton />
                    <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                        <List className={``}>
                            <ListItem onClick={() => setIsDrawerOpen(false)}>
                                <Link href={'/'}><ListItemText primary="Home" /></Link>
                            </ListItem>

                            <ListItem onClick={() => setIsDrawerOpen(false)}>
                                <Link href={'/week'}><ListItemText primary="Week View" /></Link>
                            </ListItem>
                            <ListItem onClick={() => setIsDrawerOpen(false)}>
                                <Link href={'/calendar'}><ListItemText primary="Calendar View" /></Link>
                            </ListItem>
                        </List>
                    </Drawer>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default NavBar;