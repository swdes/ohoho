const offerBusiness = require('../business/offers')

/**
 * Get offers from the current connected user
 * @param {*} request 
 * @param {*} response 
 */
function getMyOffers(request, response) {
    offerBusiness.getOffers(request.user.user_id)
        .then((offers) => {
            return response.json(offers);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

/**
 * Add a new Offer on a Todo
 * @param {*} request 
 * @param {*} response 
 */
function addOffer(request, response) {
    offerBusiness.addOffer({
        userId: request.user.user_id,
        todoId: request.body.todoId,
        type: request.body.type,
        description: request.body.description
    })
        .then((doc) => {
            response.json(doc);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

function editOffer(request, response) {
    offerBusiness.editOffer(
        request.params.offerId,
        request.body.description,
        request.body.type,
    )
        .then((doc) => {
            return response.json({ message: "offer updated" });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

function removeOffer(request, response) {
    return offerBusiness.deleteOffer(request.params.offerId)
        .then((doc) => {
            return response.json(doc);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.message });
        })
}

module.exports = {
    getMyOffers,
    addOffer,
    editOffer,
    removeOffer
}