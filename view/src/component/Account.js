import React, { Component } from 'react';
import withNavigate from '../util/withNavigate';

import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@mui/material';

import clsx from 'clsx';

import axios from 'axios';
import config from "../config"
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {},
    details: {
        display: 'flex'
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    locationText: {
        paddingLeft: '15px'
    },
    buttonProperty: {
        position: 'absolute',
        top: '50%'
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    progess: {
        position: 'absolute'
    },
    uploadButton: {
        marginLeft: '8px',
        margin: theme.spacing(1)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px'
    }
});

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            profilePicture: '',
            uiLoading: true,
            buttonLoading: false,
            imageError: '',
            isAdult: false
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
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    isAdult: response.data.userCredentials.isAdult,
                    uiLoading: false
                });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.navigate('/login');
                }
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleCheck = (event) => {
        console.log("handleCheck:", event)
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    handleImageChange = (event) => {
        this.setState({
            image: event.target.files[0]
        });
    };

    profilePictureHandler = (event) => {
        event.preventDefault();
        this.setState({
            uiLoading: true
        });
        authMiddleWare(this.props.navigate);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', this.state.image);
        form_data.append('content', this.state.content);
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .post(config.API + '/user/image', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.navigate('/login');
                }
                console.log(error);
                this.setState({
                    uiLoading: false,
                    imageError: 'Error in posting the data'
                });
            });
    };

    updateFormValues = (event) => {
        event.preventDefault();
        this.setState({ buttonLoading: true });
        authMiddleWare(this.props.navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        console.log(this.state)
        const formRequest = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            isAdult: this.state.isAdult
        };
        axios
            .post(config.API + '/user', formRequest)
            .then(() => {
                this.setState({ buttonLoading: false });
                window.location.reload();
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    this.props.navigate('/login');
                }
                console.log(error);
                this.setState({
                    buttonLoading: false
                });
            });
    };

    render() {
        const { classes, ...rest } = this.props;
        if (this.state.uiLoading === true) {
            return (
                <div>
                    {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </div>
            );
        } else {
            return (
                <div>
                    <Card {...rest} className={clsx(classes.root, classes)}>
                        <CardContent>
                            <div className={classes.details}>
                                <div>
                                    <Typography className={classes.locationText} gutterBottom variant="h4">
                                        {this.state.firstName} {this.state.lastName}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        startIcon={<CloudUploadIcon />}
                                        className={classes.uploadButton}
                                        onClick={this.profilePictureHandler}
                                    >
                                        Upload Photo
                                    </Button>
                                    <input type="file" onChange={this.handleImageChange} />

                                    {this.state.imageError ? (
                                        <div className={classes.customError}>
                                            {' '}
                                            Wrong Image Format || Supported Format are PNG and JPG
                                        </div>
                                    ) : (
                                        false
                                    )}
                                </div>
                            </div>
                            <div className={classes.progress} />
                        </CardContent>
                        <Divider />
                    </Card>

                    <br />
                    <Card {...rest} className={clsx(classes.root, classes)}>
                        <form autoComplete="off" noValidate>
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="First name"
                                            margin="dense"
                                            name="firstName"
                                            variant="outlined"
                                            value={this.state.firstName}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Last name"
                                            margin="dense"
                                            name="lastName"
                                            variant="outlined"
                                            value={this.state.lastName}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            margin="dense"
                                            name="email"
                                            variant="outlined"
                                            disabled={true}
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={this.state.isAdult} name="isAdult" onChange={this.handleCheck} />} label="Je suis un adulte et je file un coup de main au Père Noël" />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <CardActions />
                        </form>
                    </Card>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        className={classes.submitButton}
                        onClick={this.updateFormValues}
                        disabled={
                            this.state.buttonLoading ||
                            !this.state.firstName ||
                            !this.state.lastName
                        }
                    >
                        Enregistrer
                        {this.state.buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                    </Button>
                </div>
            );
        }
    }
}

//export default withStyles(styles)(Account);
export default withStyles(styles)(withNavigate(Account))
