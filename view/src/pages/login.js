// Material UI components
import React, { Component } from 'react';
import withNavigate from '../util/withNavigate';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import config from "../config"


const styles = (theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    progess: {
        position: 'absolute'
    }
});

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: [],
            loading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        axios
            .post(config.API + '/login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                this.setState({
                    loading: false,
                });
                this.props.navigate('/');
            })
            .catch((error) => {
                debugger
                this.setState({
                    errors: error.response.data,
                    loading: false
                });
            });
    };

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            onChange={this.handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            onChange={this.handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSubmit}
                            disabled={loading || !this.state.email || !this.state.password}
                        >
                            Se connecter
                            {loading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="signup" variant="body2">
                                    {"Pas encore de compte? S'enregistrer"}
                                </Link>
                            </Grid>
                        </Grid>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                    </form>
                </div>
            </Container>
        );
    }
}

//export default withStyles(styles)(Login);

// Wrap and export
export default withStyles(styles)(withNavigate(Login))
