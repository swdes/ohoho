import React, { useContext, useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Stack, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { Box, Grid } from "@mui/material"

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr'

//API
import { removeOffer } from '../../service/api'

// Context
import UserContext from '../../context/UserContext';
import { useInRouterContext } from 'react-router';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    //textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.light
}));

export default function TodoCard(props) {
    const authenticatedUserId = useContext(UserContext)
    console.log('TodoCard authenticatedUserId', authenticatedUserId)
    const { todo, isSanta } = props
    return (
        <Card className={props.classes.root} variant="outlined" key="{todo.todoId}">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="h5" component="h2">
                            {todo.title}
                        </Typography>
                        <Typography className={props.classes.pos} color="textSecondary">
                            {dayjs(todo.createdAt).fromNow()}
                        </Typography>

                        <Typography variant="body2" component="p">
                            {`${todo.body.substring(0, 65)}`}
                        </Typography>
                    </Grid>



                    {isSanta &&
                        <Grid item xs={12} sm={12}>
                            <Stack spacing={2}>
                                {todo.offers.map((offer) =>
                                (<Item elevation={0} key={offer.id}>
                                    {authenticatedUserId !== offer.userId &&
                                        <div>
                                            {(offer.type === "PART") &&
                                                <span><b>{offer.user.firstName}</b> veut participer : </span>
                                            }
                                            {(offer.type === "FULL") &&
                                                <span><b>{offer.user.firstName}</b> s'en charge : </span>
                                            }
                                            <br />"{offer.description}"
                                        </div>
                                    }
                                    {authenticatedUserId === offer.userId &&
                                        <div>
                                            <div>
                                                {(offer.type === "PART") ? "Vous participez : " : "Vous prenez en charge : "} "{offer.description}"
                                            </div>
                                            <IconButton aria-label="edit" onClick={() => props.handleOfferOpen(offer)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => props.deleteOffer(offer.offerId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    }
                                </Item>)
                                )}
                            </Stack>
                        </Grid>
                    }
                </Grid>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => props.handleViewOpen({ todo: todo })}>
                    {' '}
                    Voir{' '}
                </Button>
                {isSanta &&
                    <Button size="small" color="primary" onClick={() => props.handleOfferOpen({ todoId: todo.todoId })}>
                        Participer
                    </Button>
                }
                {!isSanta &&
                    <Button size="small" color="primary" onClick={() => props.handleEditClickOpen({ todo: todo })}>
                        Modifier
                    </Button>
                }
                {!props.userId &&
                    <Button size="small" color="primary" onClick={() => props.deleteTodoHandler({ todo: todo })}>
                        Supprimer
                    </Button>
                }
            </CardActions>
        </Card>
    )
}