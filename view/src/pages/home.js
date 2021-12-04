import React, { Component } from 'react';
import withNavigate from '../util/withNavigate';
import axios from 'axios';

import Account from '../component/Account';
import Todo from '../component/Todo';
import Santa from '../component/Santa';

import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import withStyles from '@mui/styles/withStyles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NotesIcon from '@mui/icons-material/Notes';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CircularProgress from '@mui/material/CircularProgress';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

import { authMiddleWare } from '../util/auth'
import config from "../config"

import Main from '../component/commons/Main'

// Context
import UserContext from '../context/UserContext'


const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0,
        marginTop: 20
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    toolbar: theme.mixins.toolbar
});

const pageEnum = {
    TODO: <Todo />,
    ACCOUNT: <Account />,
    SANTA: <Santa />
}

class Home extends Component {
    state = {
        render: pageEnum.TODO
    };

    loadAccountPage = (event) => {
        this.setState({ render: pageEnum.ACCOUNT });
    };

    loadTodoPage = (event) => {
        this.setState({ render: pageEnum.TODO });
    };

    loadSanta = (event) => {
        this.setState({ render: pageEnum.SANTA });
    };

    logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        this.props.navigate('/login');
        this.setState({ render: pageEnum.TODO });
    };

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            firstName: '',
            lastName: '',
            profilePicture: '',
            isAdult: false,
            uiLoading: true,
            imageLoading: false,
            render: pageEnum.TODO
        };
    }

    componentWillMount = () => {
        authMiddleWare(this.props.navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get(config.API + '/user')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    userId: response.data.userCredentials.userId,
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    isAdult: response.data.userCredentials.isAdult,
                    uiLoading: false,
                    profilePicture: response.data.userCredentials.imageUrl,
                    render: pageEnum.TODO
                });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.navigate('/login')
                }
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    };

    render() {
        const { classes } = this.props;

        if (this.state.uiLoading === true) {
            return (
                <div className={classes.root}>
                    {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Ohoho 2021
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        <div className={classes.toolbar} />
                        <Divider />
                        <center>
                            <Avatar src={this.state.profilePicture} className={classes.avatar} />
                            <p>
                                {' '}
                                {this.state.firstName} {this.state.lastName}
                            </p>
                        </center>
                        <Divider />
                        <List>
                            <ListItem button key="Todo" onClick={this.loadTodoPage}>
                                <ListItemIcon>
                                    {' '}
                                    <NotesIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Ma liste" />
                            </ListItem>

                            {this.state.isAdult &&
                                <ListItem button key="Santa" onClick={this.loadSanta}>
                                    <ListItemIcon>
                                        {' '}
                                        <CardGiftcardIcon />{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Père Noël" />
                                </ListItem>
                            }

                            <ListItem button key="Account" onClick={this.loadAccountPage}>
                                <ListItemIcon>
                                    {' '}
                                    <AccountBoxIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Mon Compte" />
                            </ListItem>

                            <ListItem button key="Logout" onClick={this.logoutHandler}>
                                <ListItemIcon>
                                    {' '}
                                    <ExitToAppIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Se déconnecter" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <div>
                        <UserContext.Provider value={this.state.userId} >
                            <Main>{this.state.render}</Main>
                        </UserContext.Provider>
                    </div>
                </div>
            );
        }
    }
}

//export default withStyles(styles)(Home);
export default withStyles(styles)(withNavigate(Home))
