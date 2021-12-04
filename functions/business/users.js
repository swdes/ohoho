const { db } = require('../util/admin');

async function getUser(userId) {
    const user = await db
        .doc(`/users/${userId}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            }
        })
    return user
}

async function getUsersByUserIds(userIds = []) {
    if (userIds.length === 0) return []
    const data = await db.collection('users')
        .where('userId', "in", userIds)
        .orderBy('firstName', 'asc')
        .get()
    const users = [];
    data.forEach((userDoc) => {
        users.push({
            userId: userDoc.id,
            firstName: userDoc.data().firstName,
            lastName: userDoc.data().lastName,
            email: userDoc.data().email,
            createdAt: userDoc.data().createdAt,
        });
    });
    return users
}

async function getUsers() {
    const data = await db.collection('users')
        .orderBy('firstName', 'asc')
        .get()
    const users = [];
    data.forEach((userDoc) => {
        users.push({
            userId: userDoc.id,
            firstName: userDoc.data().firstName,
            lastName: userDoc.data().lastName,
            email: userDoc.data().email,
            createdAt: userDoc.data().createdAt,
        });
    });
    return users
}

module.exports = {
    getUsers,
    getUsersByUserIds,
    getUser
}