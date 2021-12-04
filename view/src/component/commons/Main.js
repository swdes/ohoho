import React, { Component } from 'react';
import withNavigate from '../../util/withNavigate';

import withStyles from '@mui/styles/withStyles';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar
}))

class Main extends Component {

    render() {
        const { classes } = this.props
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {this.props.children}
            </main >
        )
    }
}

export default withStyles(styles)(withNavigate(Main))