import React, { Component } from 'react';
import withNavigate from '../util/withNavigate';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Main from './commons/Main'
import Todo from './Todo'

import { getUsers } from '../service/api'

import { authMiddleWare } from '../util/auth';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar
}))

class Santa extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentList: "",
            users: []
        };
    }

    async componentWillMount() {
        authMiddleWare(this.props.navigate);
        const users = await getUsers()
        this.setState({ users })

    }

    handleChange = (event) => {
        console.log(event.target.value)
        this.setState({
            currentList: event.target.value
        })
    }

    render() {
        console.log("render santa")
        const { classes } = this.props
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="h4"> Zone réservée au Père Noël</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl sx={{ m: 1, minWidth: 300 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">Voir la liste de </InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={this.state.currentList}
                                onChange={this.handleChange}
                                label="Voir la liste de"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.users.map((user) => (
                                    <MenuItem value={user.userId} key={user.userId}>{user.firstName + " " + user.lastName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Todo userId={this.state.currentList} isSanta={true} />
            </div>
        )
    }
}

export default withStyles(styles)(withNavigate(Santa))