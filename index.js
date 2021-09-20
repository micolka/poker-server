const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { addUser, getUser, deleteUser, getUsers, findRoom } = require('./users')
const { addIssue, deleteIssue, getIssues, editIssue } = require('./issues')
const { addPool, delPool, putVote, checkPoolResults } = require('./kickPool')


app.use(cors())

io.on('connection', (socket) => {
    socket.on('createRoom', ( userData, callback ) => {
        const master = true;
        const { user, error } = addUser(socket.id, userData, socket.id, master)
        if (error) return callback(error)
        console.log(`User ${user.name} connected`)
        socket.join(user.room)
        io.in(user.room).emit('users', getUsers(user.room))
        callback()
    })

    socket.on('checkRoom', ( room, callback ) => {      
        callback(findRoom(room))
    })

    socket.on('login', (userData, room, callback) => {
        const master = false;
        const { user, error } = addUser(socket.id, userData, room, master)
        if (error) return callback(error)
        socket.join(user.room)
        // все получают - он нет
        socket.in(room).emit('notification', { description: `${user.name} just entered the room` })
        // все получают - он тоже
        io.in(room).emit('users', getUsers(room))
        io.in(room).emit('issues', getIssues(room))
        callback()
    })

    socket.on('kickPlayer', (id) => {
        const user = deleteUser(id)
        if (user) {
            console.log(`User ${user.name} kicked by master`)
            io.in(user.room).emit('notification', { description: `${user.name} kicked by master` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })

    socket.on('triggerKickPool', (targetId, initiatorId) => {
        const user = getUser(targetId)
        if (user && !user.master) {
            addPool(targetId, initiatorId)
            io.in(user.room).emit('startKickPool', targetId, initiatorId)
            console.log(`User ${user.name} kicking pool is started...`)
        }

        // settimeout variant
    })

    socket.on('setKickDecision', (targetId, answer) => {
        const result = putVote(targetId, answer, socket.id)
        if (result === undefined) return
        if (result === 'in progress') return
        if (result === true) {
            const user = deleteUser(targetId)
            if (user) {
                console.log(`User ${user.name} kicked by voting`)
                io.in(user.room).emit('notification', { description: `${user.name} kicked by voting` })
                io.in(user.room).emit('users', getUsers(user.room))
            }
        } 
        if (result === false) {
            const user = getUser(targetId)
            console.log(`User ${user.name} wasn't kicked by voting`)
            io.in(user.room).emit('notification', { description: `${user.name} will stay in room` })
        }
        delPool(targetId)
    })

    socket.on('addIssue', (issueData, room, callback) => {
        const { issue, error } = addIssue(issueData, room)
        if (error) return callback(error)
        io.in(issue.room).emit('issues', getIssues(issue.room))
    })

    socket.on('editIssue', (issueData) => {
        const { issue, error } = editIssue(issueData)
        if (error) return callback(error)
        io.in(issue.room).emit('issues', getIssues(issue.room))
    })

    socket.on('deleteIssue', (issueID, callback) => {
        const issue = deleteIssue(issueID)
        io.in(issue.room).emit('issues', getIssues(issue.room))
        callback(issue.name)
    })

    socket.on('sendMessage', message => {
        console.log('message user ' + socket.id);
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user, message })
    })

    socket.on("disconnect", () => {
        const user = deleteUser(socket.id)
        if (user) {
            console.log(`User ${user.name} disconnected`);
            io.in(user.room).emit('notification', { description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })
})

app.get('/', (req, res) => {
    res.send("Server is up and running")
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`)
})