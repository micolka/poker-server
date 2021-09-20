const { getUser, getUsers } = require('./users')

const pools = []

const addPool = (targetId, initiatorId) => {

  const pool = {}
  pool[targetId] = {}
  const room = getUser(targetId).room
  const users = getUsers(room)

  users.forEach( el => {
    if (!el.master 
        && el.playerId !== initiatorId 
        && el.playerId !== targetId ) {
      pool[targetId][el.playerId] = null
    }
  })

  pools.push(pool)
  return pool
}

const getPool = (targetId) => {
  const pool = pools.find(el => el.hasOwnProperty(targetId))
  if (pool) return pool[targetId] 
  return
}

const putVote = (targetId, answer, id) => {
  const pool = getPool(targetId)
  if (pool && pool.hasOwnProperty(id)) {
    pool[id] = answer
    return checkPoolResults(targetId)
  }
  return
}

const checkPoolResults = (targetId) => {
  const pool = getPool(targetId)
  const keys = Object.keys(pool)
  const playersCount = keys.length + 1
  let voteYes = 1;
  let voteNo = 0;

  keys.forEach(el => {
    if (pool[el] === true) voteYes++
    if (pool[el] === false) voteNo++
  })

  if (voteYes > playersCount / 2) {
    return true
  } else if (voteNo >= playersCount / 2) {
    return false
  }

  return 'in progress'
}

const delPool = (targetId) => {
  const index = pools.findIndex(el => el.hasOwnProperty(targetId))
  if (index !== -1) return pools.splice(index, 1)[0]
}

module.exports = { addPool, getPool, putVote, checkPoolResults, delPool }