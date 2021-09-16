const users = []

const addUser = (id, userData, room, isMaster) => {
    // const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    // if (existingUser) return { error: "Username has already been taken" }
    if (!userData && !room) return { error: "userData and room are required" }
    if (!userData) return { error: "userData is required" }
    if (!room) return { error: "Room is required" }

    const user = { id, ...userData, room,  isMaster }
    users.push(user)
    return { user }
}

const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
}

const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
}

const getUsers = (room) => users.filter(user => user.room === room)

const findRoom = (room) => {
    const index = users.findIndex(user => user.room === room)
    return (index !== -1) ? true : false
}

module.exports = { addUser, getUser, deleteUser, getUsers, findRoom }