const { db } = require('../util/admin');
const _ = require('lodash')

function validateOffer(offer) {
    if (!offer.userId) throw new Error('missing userId')
    if (!offer.todoId) throw new Error('missing todoId')
    validateType(offer.type)
    return true
}

function validateType(type) {
    if (!['PART', "FULL"].includes(type)) throw new Error('wrong offer type')
}

function getOffers(userId) {
    return db
        .collection('offers')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let offers = [];
            data.forEach((doc) => {
                offers.push({
                    offerId: doc.id,
                    todoId: doc.data().todoId,
                    userId: doc.data().userId,
                    description: doc.data().description,
                    type: doc.data().type,
                    createdAt: doc.data().createdAt,
                });
            });
            return offers
        })
}

function getOffersByTodoIds(todoIds) {
    console.info('getOffersByTodoIds: ' + todoIds)
    if (!todoIds || todoIds.length < 1) return []

    return Promise.all(_.chunk(todoIds, 10).map(todoIdsChunk => {
        return db
            .collection('offers')
            .where('todoId', 'in', todoIdsChunk)
            .orderBy('createdAt', 'desc')
            .get()
            .then((data) => {
                let offers = [];
                data.forEach((doc) => {
                    offers.push({
                        todoId: doc.data().todoId,
                        offerId: doc.id,
                        userId: doc.data().userId,
                        description: doc.data().description,
                        type: doc.data().type,
                        createdAt: doc.data().createdAt,
                    });
                });
                return offers
            })
    }))
        .then(_.flatten)

}

function addOffer({ todoId, userId, description, type }) {

    const newOffer = {
        todoId,
        userId,
        description,
        createdAt: new Date().toISOString(),
        type
    }

    validateOffer(newOffer)

    return db
        .collection('offers')
        .add(newOffer)
        .then((doc) => {
            return { ...newOffer, id: doc.id }
        })
}

function editOffer(offerId, description, type) {
    let document = db.collection('offers').doc(`${offerId}`);
    validateType(type)
    return document.update({ description, type })
        .then(() => {
            console.log('docuemnt updated')
            return true
        })
}

function deleteOffer(offerId) {
    const document = db.doc(`/offers/${offerId}`)
    return document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                throw new Error('offer not found')
            }
            return document.delete();
        })
}

module.exports = {
    getOffers,
    getOffersByTodoIds,
    addOffer,
    editOffer,
    deleteOffer
}