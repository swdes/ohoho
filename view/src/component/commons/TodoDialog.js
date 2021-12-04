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

export default function TodoDialog(props) {
    return (
        <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={this.props.open}
            onClose={this.propos.handleClose}
            TransitionComponent={this.props.Transition}>
            <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
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
                            helperText={this.props.errors.title}
                            value={this.state.title}
                            error={this.props.errors.title ? true : false}
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
                            helperText={this.props.errors.body}
                            error={this.props.errors.body ? true : false}
                            onChange={this.handleChange}
                            value={this.state.body}
                        />
                    </Grid>
                </Grid>
            </MuiDialogContent>
            <DialogActions>
                <Button
                    onClick={this.props.handleSubmit}
                >
                    {this.props.isEdit === 'Edit' ? 'Enregistrer' : 'Créer'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}