const { db } = require('../util/admin');
const { getOffersByTodoIds } = require('./offers')
const { getUsersByUserIds } = require('./users')
const _ = require('lodash')

/**
 * Get all the todos for a given userId and all the offers attached to this todos
 * @param {*} userId 
 * @returns 
 */
async function getTodosWIthOffers(userId) {
    const data = await db.collection('todos')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get()

    const todos = {};
    const todoIds = []
    data.forEach((doc) => {
        todos[doc.id] = {
            todoId: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            createdAt: doc.data().createdAt,
            offers: []
        }
        todoIds.push(doc.id)
    })
    const offers = await getOffersByTodoIds(todoIds)
    const users = _.keyBy(await getUsersByUserIds(offers.map(offer => offer.userId)), 'userId')
    offers.forEach((offer) => {
        offer.user = users[offer.userId]
        todos[offer.todoId].offers.push(offer)
    })
    return Object.values(todos)
}

module.exports = {
    getTodosWIthOffers
}