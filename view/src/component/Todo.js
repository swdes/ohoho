import React, { Component } from 'react'
import withNavigate from '../util/withNavigate';

import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';
import config from "../config"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr'
import { authMiddleWare } from '../util/auth';
import { getOffers, getTodos, removeOffer, getOffer } from '../service/api';
import { ThemeProvider } from '@emotion/react';

import TodoCard from './commons/TodoCard';
import OfferDialog from './commons/OfferDialog';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,

    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    submitButton: {
        display: 'block',
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        top: 14,
        right: 10
    },
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0
    },
    form: {
        width: '98%',
        marginLeft: 13,
        marginTop: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {
        minWidth: 470
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)'
    },
    pos: {
        marginBottom: 12
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    dialogeStyle: {
        maxWidth: '50%'
    },
    viewRoot: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
})
);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: '',
            title: '',
            body: '',
            todoId: '',
            errors: [],
            open: false,
            uiLoading: true,
            buttonType: '',
            viewOpen: false,
            userId: "",
            offerDialogOpen: false,
            offerDialogOffer: {}
        };

        this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
        this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
        this.editOffer = this.editOffer.bind(this)
        this.deleteOffer = this.deleteOffer.bind(this)
        this.handleCloseOfferDialog = this.handleCloseOfferDialog.bind(this)
        this.handleOpenOfferDialog = this.handleOpenOfferDialog.bind(this)
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    refreshOffers(userId) {
        this.setState({
            uiLoading: true
        })
        if (!userId || userId === "") {
            this.setState({
                todos: [],
                uiLoading: false,
                userId: userId
            })
            return
        }
        return getOffers(userId)
            .then((offers) => {
                if (!offers) this.props.navigate('/login')
                this.setState({
                    todos: offers,
                    uiLoading: false,
                    userId: userId
                });
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    todos: [],
                    uiLoading: false,
                    userId: userId
                })
            })

    }

    componentWillMount = () => {
        authMiddleWare(this.props.navigate);
        console.log("componentWillMount userId", this.props.userId)
        if (this.props.isSanta) {
            this.refreshOffers(this.props.userId)
        } else {
            getTodos()
                .then((todos) => {
                    if (!todos) this.props.navigate('/login')
                    this.setState({
                        todos,
                        uiLoading: false
                    });
                })
        }

    };

    componentDidUpdate(prevProps) {
        //console.log("componentDidUpdate userId", this.props.userId)
        if (prevProps.userId !== this.props.userId) {
            // console.log('need a refresh from', prevProps.userId)
            return this.refreshOffers(this.props.userId)
        }
    }

    deleteTodoHandler(data) {
        authMiddleWare(this.props.navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let todoId = data.todo.todoId;
        axios
            .delete(config.API + `/todo/${todoId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleEditClickOpen(data) {
        this.setState({
            title: data.todo.title,
            body: data.todo.body,
            todoId: data.todo.todoId,
            buttonType: 'Edit',
            open: true
        });
    }

    handleViewOpen(data) {
        this.setState({
            title: data.todo.title,
            body: data.todo.body,
            viewOpen: true
        });
    }

    editOffer(offerId) {
        console.log('edit', offerId)
    }
    async deleteOffer(offerId) {
        console.log('delete', offerId)
        // modify state
        await removeOffer(offerId)
        this.refreshOffers(this.state.userId)
    }

    handleOpenOfferDialog(offer) {
        console.log("handleOpenOfferDialog", offer)
        this.setState({
            offerDialogOpen: true,
            offerDialogOffer: offer
        })
    }

    handleCloseOfferDialog(hasChanged = false) {
        this.setState({
            offerDialogOpen: false
        })
        if (hasChanged) this.refreshOffers(this.state.userId)
    }

    render() {
        const DialogTitle = withStyles(styles)((props) => {
            const { children, classes, onClose, ...other } = props;
            return (
                <MuiDialogTitle disableTypography className={classes.root} {...other}>
                    <Typography variant="h6">{children}</Typography>
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={onClose}
                            size="large">
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </MuiDialogTitle>
            );
        });

        const DialogContent = withStyles((theme) => ({
            viewRoot: {
                marginTop: theme.spacing(2),
                padding: theme.spacing(2)
            }
        }))(MuiDialogContent);

        dayjs.extend(relativeTime);
        dayjs.locale('fr')
        const { classes } = this.props;
        const { open, errors, viewOpen } = this.state;

        const handleClickOpen = () => {
            this.setState({
                todoId: '',
                title: '',
                body: '',
                buttonType: '',
                open: true
            });
        };

        const handleSubmit = (event) => {
            authMiddleWare(this.props.navigate);
            event.preventDefault();
            const userTodo = {
                title: this.state.title,
                body: this.state.body
            };
            let options = {};
            if (this.state.buttonType === 'Edit') {
                options = {
                    url: config.API + `/todo/${this.state.todoId}`,
                    method: 'put',
                    data: userTodo
                };
            } else {
                options = {
                    url: config.API + '/todo',
                    method: 'post',
                    data: userTodo
                };
            }
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = { Authorization: `${authToken}` };
            axios(options)
                .then(() => {
                    this.setState({ open: false });
                    window.location.reload();
                })
                .catch((error) => {
                    this.setState({ open: true, errors: error.response.data });
                    console.log(error);
                });
        };

        const handleViewClose = () => {
            this.setState({ viewOpen: false });
        };

        const handleClose = (event) => {
            this.setState({ open: false });
        };

        //this.refreshOffers(this.props.userId)

        if (this.state.uiLoading === true) {
            return (
                <div>
                    {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </div>
            );
        } else {
            return (
                <div>
                    {!this.props.userId &&
                        <IconButton
                            className={classes.floatingButton}
                            color="primary"
                            aria-label="Add Todo"
                            onClick={handleClickOpen}
                            size="large">
                            <AddCircleIcon style={{ fontSize: 60 }} />
                        </IconButton>
                    }
                    <Dialog
                        fullWidth={true}
                        maxWidth={"md"}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Transition}>
                        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                            {this.state.buttonType === 'Edit' ? 'Modifier' : 'Créer un nouveau souhait'}
                        </DialogTitle>
                        <MuiDialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        autofocus
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="todoTitle"
                                        label="Titre"
                                        name="title"
                                        autoComplete="todoTitle"
                                        helperText={errors.title}
                                        value={this.state.title}
                                        error={errors.title ? true : false}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="todoDetails"
                                        label="Description"
                                        name="body"
                                        autoComplete="todoDetails"
                                        multiline
                                        rows={5}
                                        maxRows={25}
                                        helperText={errors.body}
                                        error={errors.body ? true : false}
                                        onChange={this.handleChange}
                                        value={this.state.body}
                                    />
                                </Grid>
                            </Grid>
                        </MuiDialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleSubmit}
                            >
                                {this.state.buttonType === 'Edit' ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <OfferDialog
                        open={this.state.offerDialogOpen}
                        offer={this.state.offerDialogOffer}
                        handleClose={this.handleCloseOfferDialog}
                    />

                    <Grid container spacing={2}>
                        {this.state.todos.map((todo) => (
                            <Grid item xs={12} sm={6} key={todo.todoId}>
                                <TodoCard
                                    key={todo.todoId}
                                    classes={classes}
                                    todo={todo}
                                    handleViewOpen={this.handleViewOpen}
                                    handleOfferOpen={this.handleOpenOfferDialog}
                                    handleEditClickOpen={this.handleEditClickOpen}
                                    deleteTodoHandler={this.deleteTodoHandler}
                                    editOffer={this.editOffer}
                                    deleteOffer={this.deleteOffer}
                                    isSanta={this.props.isSanta}
                                    userId={this.props.userId}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Dialog
                        onClose={handleViewClose}
                        aria-labelledby="customized-dialog-title"
                        open={viewOpen}
                        fullWidth
                        classes={{ paperFullWidth: classes.dialogeStyle }}
                    >
                        <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                            {this.state.title}
                        </DialogTitle>
                        <DialogContent dividers>
                            <TextField
                                fullWidth
                                id="todoDetails"
                                name="body"
                                multiline
                                readonly
                                rows={5}
                                maxRows={25}
                                value={this.state.body}
                                InputProps={{
                                    disableUnderline: true
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                </div>
            );
        }
    }
}

export default (withStyles(styles)(withNavigate(Todo)));