const { IdGenerator } = require('./utils')

const issues = []

const addIssue = (issueData, room) => {
  if (!issueData && !room) return { error: "issueData and room are required" }
  if (!issueData) return { error: "issueData is required" }
  if (!room) return { error: "Room is required" }

  let id = undefined
  do {
    id = IdGenerator()
  } while (issues.find( issue => issue.id === id))

  const issue = {id, ...issueData, room}
  issues.push(issue)
  return {issue}
}

const getIssue = id => { 
  let issue = issues.find((issue) => {id === issue.id})
  return issue
}

const deleteIssue = (id) => {
  const index = issues.findIndex((issue) => issue.id === id);
  if (index !== -1) return issues.splice(index, 1)[0];
}

const getIssues = (room) => issues.filter(issue => issue.room === room)

// TODO!! del issues on disconnect of master

module.exports = { addIssue, getIssue, deleteIssue, getIssues}