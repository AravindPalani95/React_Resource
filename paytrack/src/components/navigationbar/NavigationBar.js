import { Link } from 'react-router-dom';
import { useState } from "react"
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItemText,
    SwipeableDrawer,
    ListItemButton,
    ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';

function NavigationBar(props) {
    const menus = [
        {
            menuName: 'Dashboard',
            path: '/dashboard'
        },
        {
            menuName: 'Reports',
            path: '/reports'
        },
        {
            menuName: 'Notifications',
            path: '/notifications'
        },
        {
            menuName: 'Payment Bucket',
            path: '/paymentbucket'
        }
    ]
    const [isOpen, setIsOpen] = useState(false);
    // toggle drawer
    const toggleDrawer = (open) => {
        setIsOpen(open)
    }

    const getIcon = (menuName) =>{
        switch(menuName){
            case 'Dashboard':
                return <DashboardOutlinedIcon/>
            case 'Reports':
                return <TableChartOutlinedIcon/>
            case 'Notifications':
                return <MailOutlineOutlinedIcon/>
            case 'Payment Bucket':
                return <CallSplitOutlinedIcon/>
            default:
                return <></>
        }
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        PayTrack - Insights
                    </Typography>
                </Toolbar>
                <SwipeableDrawer
                    PaperProps={{ style: { width: '15%' } }}
                    open={isOpen}
                    onOpen={() => toggleDrawer(true)}
                    onClose={() => toggleDrawer(false)}
                >
                    <List>
                        {
                            menus.map(menu => {
                                return (
                                    <ListItemButton key={menu.menuName} component={Link} to={menu.path} onClick={() => toggleDrawer(false)} disablePadding>
                                        <ListItemIcon>
                                            {
                                                getIcon(menu.menuName)
                                            }
                                        </ListItemIcon>
                                        <ListItemText primary={menu.menuName}></ListItemText>
                                    </ListItemButton>
                                )
                            })
                        }
                    </List>
                </SwipeableDrawer>
            </AppBar>
        </div>
    )
}

export default NavigationBar