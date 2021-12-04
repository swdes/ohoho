const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const auth = require('./util/auth');

// Automatically allow cross-origin requests
app.use(cors({
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.options('*', cors())

// Logger
const reqLogger = require('./util/reqLogger')
app.use(reqLogger)

/**
 * TODO APIS
 */
const {
    getAllTodos,
    //getOneTodo,
    getTodosWithOffers,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./api/todos')

app.get('/todos', auth, getAllTodos)
app.get('/todos/:userId', auth, getTodosWithOffers)
//app.get('/todo/:todoId', auth, getOneTodo);
app.post('/todo', auth, postOneTodo)
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

/**
 * USERS APIS
 */
const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails,
    getUsers
} = require('./api/users')


// Users
app.post('/login', loginUser)
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);
app.get('/users', auth, getUsers)


/**
 * OFFERS
 */
const { getMyOffers, addOffer, editOffer, removeOffer } = require('./api/offers')
app.get('/offers', auth, getMyOffers)
app.post('/offer', auth, addOffer)
app.put('/offer/:offerId', auth, editOffer)
app.delete('/offer/:offerId', auth, removeOffer)

exports.api = functions
    .region("europe-west1")
    .https.onRequest(app);






