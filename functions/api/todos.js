const { db } = require('../util/admin');
const { getTodosWIthOffers } = require('../business/todos')

exports.getAllTodos = (request, response) => {
    db
        .collection('todos')
        .where('userId', '==', request.user.user_id)
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let todos = [];
            data.forEach((doc) => {
                todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                });
            });
            return response.json(todos);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.getTodosWithOffers = (request, response) => {
    console.log("start getTodosWithOffers with ", request.params.userId)
    return getTodosWIthOffers(request.params.userId)
        .then((todos) => {
            return response.json(todos)
        })
}

exports.postOneTodo = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Must not be empty' });
    }

    if (request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    const newTodoItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString(),
        userId: request.user.user_id
    }
    db
        .collection('todos')
        .add(newTodoItem)
        .then((doc) => {
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
            response.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        });
};

exports.deleteTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
    console.log('start deleting todo')
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Todo not found' })
            }
            if (doc.data().userId !== request.user.user_id) {
                return response.status(403).json({ error: "UnAuthorized" })
            }
            return document.delete();
        })
        .then(() => {
            console.log('todo deleted: ', request.params.todoId)
            return response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editTodo = (request, response) => {
    if (request.body.todoId || request.body.createdAt) {
        response.status(403).json({ message: 'Not allowed to edit' });
    }
    let document = db.collection('todos').doc(`${request.params.todoId}`);
    document.update(request.body)
        .then(() => {
            response.json({ message: 'Updated successfully' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({
                error: err.code
            });
        });
};