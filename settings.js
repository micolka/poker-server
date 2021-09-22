const settingsStorage = []

const saveSettings = (settingsData, room) => {
  if (!settingsData && !room) return { error: "settingsData and room are required" }
  if (!settingsData) return { error: "settingsData is required" }
  if (!room) return { error: "Room is required" }

  if (getSettings(room)) {
    return editSettings(settingsData, room)
  }

  const settings = {...settingsData, room}
  settingsStorage.push(settings)
  return {settings}
}

const getSettings = room => { 
  let settings = settingsStorage.find((el) => room === el.room)
  return settings
}

const deleteSettings = (room) => {
  const index = settingsStorage.findIndex((el) => el.room === room)
  if (index !== -1) return settingsStorage.splice(index, 1)[0]
}

const editSettings = (settingsData, room) => {
  if (!settingsData) return { error: "issueData is required" }
  const index = settingsStorage.findIndex((el) => el.room === room)
  settingsStorage[index] = {...settingsData, room}
  return {settings: settingsStorage[index]}
}

// TODO!! del settings on disconnect of master

module.exports = { saveSettings, getSettings, deleteSettings, editSettings}