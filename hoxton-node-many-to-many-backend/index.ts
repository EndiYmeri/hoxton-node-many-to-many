import Database from "better-sqlite3";
import cors from "cors";
import express from "express";

const db = new Database('./data.db',{
    verbose: console.log
})

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 4000



// Helper functions d
const getAllInterviewers = db.prepare(`SELECT * FROM interviewers;`)
const getInterviewer = db.prepare(`SELECT * FROM interviewers WHERE id=?;`)
const getInterviewsWithInterviewerID = db.prepare(`
    SELECT applicants.*, interviews.date, interviews.score FROM applicants
    JOIN interviews ON applicants.id = interviews.applicantID
    WHERE interviews.interviewerID = ?;
`)

const getAllApplicants = db.prepare(`SELECT * FROM applicants;`)
const getApplicant = db.prepare(`SELECT * FROM applicants WHERE id=?;`)
const getInterviewsWithApplicantID = db.prepare(`
    SELECT interviewers.*, interviews.date, interviews.score FROM interviewers
    JOIN interviews ON interviewers.id = interviews.interviewerID
    WHERE interviews.applicantID = ?;
`)

const getAllInterviews = db.prepare(`SELECT * FROM interviews`)
const getInterview = db.prepare(`SELECT * FROM interviews WHERE id=?`)

const createInterviewer= db.prepare(`INSERT INTO interviewers(name,email) VALUES(?,?)`)
const createApplicant = db.prepare(`INSERT INTO applicants(name,email) VALUES(?,?)`)
const createInterview = db.prepare(`INSERT INTO interviews(interviewerID, applicantID, date, score) VALUES(?,?,?,?)`)


const updateInterviewer = db.prepare('UPDATE interviewers SET name=?, email=? WHERE id=?')
const updateApplicant = db.prepare('UPDATE applicants SET name=?, email=? WHERE id=?')
const updateInterview = db.prepare('UPDATE interviews SET interviewerID = ?, applicantID = ?, date = ?, score=? WHERE id=?')



const deleteInterview = db.prepare(`DELETE FROM interviews WHERE id = ?`)
const deleteInterviewer = db.prepare(`DELETE FROM interviewers WHERE id = ?`)
const deleteApplicant = db.prepare(`DELETE FROM applicants WHERE id = ?`)






app.get('/',(req,res)=>{
    res.send(`
    <h1>This is our new interviews app</h1>
    <p>check the routes for more info</p>
    `)
})

app.get('/interviewers',(req,res)=>{
    const interviewers = getAllInterviewers.all()

    for(const interviewer of interviewers){
        interviewer.interviews = getInterviewsWithInterviewerID.all(interviewer.id)
    }

    res.send(interviewers)
})

app.post('/interviewers',(req,res)=>{
    const name = req.body.name
    const email = req.body.email

    let errors = []

    if(typeof name !== 'string') errors.push('Name missing')
    if(typeof email !== 'string') errors.push('Email missing')

    if(errors.length > 0 ){
        res.status(406).send({errors})
    }else{
        const result = createInterviewer.run(name, email)
        if(result.changes > 0){
            const newInterviewer = getInterviewer.get(result.lastInsertRowid)
            res.send(newInterviewer)
        }
    }
})

app.get('/interviewers/:id',(req,res)=>{
    const id = req.params.id
    const interviewer = getInterviewer.get(id)
    
    if(interviewer){
        interviewer.interviews = getInterviewsWithInterviewerID.all(interviewer.id)
        res.send(interviewer)
    }else{
        res.status(404).send({error:"Interviewer not found"})
    }
})

app.patch('/interviewers/:id',(req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const email = req.body.email

    const currentInterviewer = getInterviewer.get(id)
    if(currentInterviewer){
        const newName = name? name : currentInterviewer.name
        const newEmail = email? email : currentInterviewer.email 
        const result = updateInterviewer.run(newName, newEmail, id)

        if(result.changes > 0){
            const updatedInterviewer = getInterviewer.get(id)
            updatedInterviewer.interviews = getInterviewsWithInterviewerID.all(id) 
            res.send(currentInterviewer)
        }
    }else{
        res.status(404).send({error:"Interviewer not found"})
    }
})

app.delete('/interviewers/:id',(req,res)=>{
    const id = req.params.id
    const interviewer = getInterviewer.get(id)
    
    if(interviewer){
        interviewer.interviews = getInterviewsWithInterviewerID.all(interviewer.id)
        if(interviewer.interviews.length === 0){
            deleteInterviewer.run(id)
            res.send({message:"Interviewer deleted succesufully"})
        }else{
            res.status(406).send({message:"Can't delete interviewer because it has interviews"})
        }
    }else{
        res.status(404).send({error:"Interviewer not found"})
    }
})

app.get('/applicants',(req,res)=>{
    const applicants = getAllApplicants.all()
    for(const applicant of applicants){
        applicant.interviews = getInterviewsWithApplicantID.all(applicant.id)
    }
    res.send(applicants)
})

app.post('/applicants',(req,res)=>{
    const name = req.body.name
    const email = req.body.email
    let errors = []
    if(typeof name !== 'string') errors.push('Name missing')
    if(typeof email !== 'string') errors.push('Email missing')

    if(errors.length > 0 ){
        res.status(406).send({errors})
    }else{
        const result = createApplicant.run(name, email)
        if(result.changes > 0){
            const newApplicant = getApplicant.get(result.lastInsertRowid)
            res.send(newApplicant)
        }
    }
})

app.get('/applicants/:id',(req,res)=>{
    const id = req.params.id
    const applicant = getApplicant.get(id)
    if(applicant){
        applicant.interviews = getInterviewsWithApplicantID.all(applicant.id)
        res.send(applicant)    
    }else res.status(404).send({error:"Applicant not found"})
    
})

app.patch('/applicants/:id',(req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const email = req.body.email

    const currentApplicant = getApplicant.get(id)
    if(currentApplicant){
        const newName = name? name : currentApplicant.name
        const newEmail = email? email : currentApplicant.email 
        const result = updateApplicant.run(newName, newEmail, id)

        if(result.changes > 0){
            const updatedApplicant = getApplicant.get(id)
            updatedApplicant.interviews = getInterviewsWithApplicantID.all(id) 
            res.send(currentApplicant)
        }
    }else{
        res.status(404).send({error:"Applicant not found"})
    }
})

app.delete('/applicants/:id',(req,res)=>{
    const id = req.params.id
    const applicant = getApplicant.get(id)
    if(applicant){
        applicant.interviews = getInterviewsWithApplicantID.all(applicant.id)
        if(applicant.interviews.length === 0){
            deleteApplicant.run(id)
            res.send({message:"Applicant deleted succesufully"})
        }else{
            res.status(406).send({message:"Can't delete Applicant because it has interviews"})
        }
    }else{
        res.status(404).send({error:"Applicant not found"})
    }
})


app.get('/interviews',(req,res)=>{
    const interviews = getAllInterviews.all()
    
    for(const interview of interviews){
        interview.applicantID = getApplicant.get(interview.applicantID)
        interview.interviewerID = getInterviewer.get(interview.interviewerID)
    }
    if(interviews){
        res.send(interviews)
    }else{
        res.status(404).send({error:"Interviews not found"})
    }
})

app.post('/interviews',(req,res)=>{
    const interviewerID = req.body.interviewerID
    const applicantID = req.body.applicantID
    const date = req.body.date
    const score = req.body.score

    let errors = []

    if(typeof interviewerID !== 'number') errors.push('InterviewerID is missing or not a number')
    if(typeof applicantID !== 'number') errors.push('ApplicantID is missing or not a number')
    if(typeof date !== 'string') errors.push('Date is missing or not a string')
    if(typeof score !== 'number') errors.push('Score is missing or not a number')

    if(errors.length > 0 ){
        res.status(406).send({errors})
    }else{
        const result = createInterview.run(interviewerID,applicantID,date,score)
        
        if(result.changes > 0){
            const newInterview = getInterview.get(result.lastInsertRowid)
            res.send(newInterview)
        }
    }
})

app.get('/interviews/:id',(req,res)=>{
    const id = req.params.id
    const interview = getInterview.get(id)
    interview.applicantID = getApplicant.get(interview.applicantID)
    interview.interviewerID = getInterviewer.get(interview.interviewerID)
    if(interview){
        res.send(interview)
    }else{
        res.status(404).send({error:"Interviews not found"})
    }
})


app.patch('/interviews/:id',(req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const email = req.body.email

    const currentInterview = getInterview.get(id)
    if(currentInterview){
        const newName = name? name : currentInterview.name
        const newEmail = email? email : currentInterview.email 
        const result = updateInterview.run(newName, newEmail, id)

        if(result.changes > 0){
            const updatedInterview = getInterview.get(id)
            updatedInterview.applicantID = getApplicant.get(updatedInterview.applicantID)
            updatedInterview.interviewerID = getInterviewer.get(updatedInterview.interviewerID)
            res.send(currentInterview)
        }
    }else{
        res.status(404).send({error:"Interview not found"})
    }
})



app.listen(PORT, ()=> `Listening on http://localhost:${PORT}`)