const { IdGenerator } = require('./utils')

let issues = []

const addIssue = (issueData, room) => {
  if (!issueData && !room) return { error: "issueData and room are required" }
  if (!issueData) return { error: "issueData is required" }
  if (!room) return { error: "Room is required" }

  let issueID = undefined
  do {
    issueID = IdGenerator()
  } while (issues.find( issue => issue.issueID === issueID))

  const issue = {issueID, ...issueData, room}
  issues.push(issue)
  return {issue}
}

const getIssue = issueID => { 
  let issue = issues.find((issue) => issueID === issue.issueID)
  return issue
}

const deleteIssue = (issueID) => {
  const index = issues.findIndex((issue) => issue.issueID === issueID)
  if (index !== -1) return issues.splice(index, 1)[0]
}

const deleteAllIssues = (room) => {
  const restIssues = issues.filter(issue => issue.room !== room)
  issues = [...restIssues]
}

const editIssue = (issueData) => {
  if (!issueData) return { error: "issueData is required" }
  const index = issues.findIndex((issue) => issue.issueID === issueData.issueID)
  issues[index] = issueData
  return {issue: issues[index]}
}

const setIssueVote = (userId, issueId, cardValue) => {
  const issue = getIssue(issueId)
  if (!issue) return { error: `Can't find issue: ${issueId}` }
  issue.poolResults.votes = {...issue.poolResults.votes, [userId]: cardValue}
  return {issue}
}

const getIssues = (room) => issues.filter(issue => issue.room === room)

module.exports = { addIssue, getIssue, deleteIssue, getIssues, editIssue, deleteAllIssues, setIssueVote}