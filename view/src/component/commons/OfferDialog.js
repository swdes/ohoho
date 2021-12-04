import { useState } from "react";
import {
    DialogContent,
    DialogTitle,
    Dialog,
    DialogActions,
    Button,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText
} from "@mui/material";
import { editOffer, addOffer } from '../../service/api'

export default function OfferDialog(props) {
    const [offer, setOffer] = useState(props.offer)
    const [errors, setErrors] = useState({})
    if (offer.offerId !== props.offer.offerId) setOffer(props.offer)
    if (offer.todoId !== props.offer.todoId) setOffer(props.offer)
    // console.log("open offer dialog", props.offer, offer)

    const handleChange = (offer) => {
        console.log('handleChange', offer)
        const newErrors = {}
        if (!offer.type) newErrors.type = "type is required"
        if (!offer.description) newErrors.description = "description is required"
        setErrors(newErrors)
        if (offer.description && offer.type) {
            if (offer.offerId) {
                editOffer(offer.offerId, { type: offer.type, description: offer.description })
                    .then(() => props.handleClose(true))
            } else {
                addOffer(offer)
                    .then(() => props.handleClose(true))
            }
        }
    }

    return (
        <Dialog open={props.open}>
            <DialogTitle>Votre participation</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset" error={errors.type ? true : false}>
                    <RadioGroup
                        aria-label="gender"
                        value={offer ? offer.type : "PART"}
                        name="radio-buttons-group"
                        onChange={(event) => setOffer({ ...offer, type: event.target.value })}
                        required
                    >
                        <FormControlLabel value="PART" control={<Radio />} label="Je veux participer" />
                        <FormControlLabel value="FULL" control={<Radio />} label="Je m'en charge" />
                        <FormHelperText>Choisir une option</FormHelperText>
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <TextField
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        defaultValue={props.offer && props.offer.description}
                        onChange={(event) => setOffer({ ...offer, description: event.target.value })}
                        required
                        multiline
                        minRows={4}
                        maxRows={4}
                        error={errors.description ? true : false}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleChange(offer)}>Enregistrer</Button>
                <Button onClick={() => props.handleClose()}>Fermer</Button>
            </DialogActions>
        </Dialog>
    )
}