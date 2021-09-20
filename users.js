const users = []

const addUser = (playerId, userData, room, master) => {
    // const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    // if (existingUser) return { error: "Username has already been taken" }
    if (!userData && !room) return { error: "userData and room are required" }
    if (!userData) return { error: "userData is required" }
    if (!room) return { error: "Room is required" }

    const user = { playerId, ...userData, room,  master }
    users.push(user)
    return { user }
}

const getUser = playerId => {
    let user = users.find(user => user.playerId == playerId)
    return user
}

const deleteUser = (playerId) => {
    const index = users.findIndex((user) => user.playerId === playerId)
    if (index !== -1) return users.splice(index, 1)[0]
}

const getUsers = (room) => users.filter(user => user.room === room)

const findRoom = (room) => {
    const index = users.findIndex(user => user.room === room)
    return (index !== -1) ? true : false
}

module.exports = { addUser, getUser, deleteUser, getUsers, findRoom }