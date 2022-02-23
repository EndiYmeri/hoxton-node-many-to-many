import Database from "better-sqlite3";

const db = new Database('./data.db',{
    verbose: console.log
})

const interviewers = [
    {name:"Company A", email:"companyA@gmail.com"},
    {name:"Company B", email:"companyB@gmail.com"},
    {name:"Company C", email:"companyC@gmail.com"},
    {name:"Company D", email:"companyD@gmail.com"}
]

const applicants = [
    {name:"White Guy", email:"whiteguy@gmail.com"},
    {name:"Red Guy", email:"redguy@gmail.com"},
    {name:"Black Guy", email:"blackguy@gmail.com"},
    {name:"Brown Guy", email:"brownguy@gmail.com"},
    {name:"Yellow Guy", email:"yellowguy@gmail.com"},
    {name:"Green Guy", email:"greenguy@gmail.com"},
]

const interviews = [
    {interviewerID: 1, applicantID: 1, date:"22/2/22", score: 89},
    {interviewerID: 1, applicantID: 2, date:"22/2/22", score: 89},
    {interviewerID: 1, applicantID: 3, date:"22/2/22", score: 89},
    {interviewerID: 1, applicantID: 4, date:"22/2/22", score: 89},
    {interviewerID: 1, applicantID: 5, date:"22/2/22", score: 89},
    {interviewerID: 1, applicantID: 6, date:"22/2/22", score: 89},
    {interviewerID: 2, applicantID: 1, date:"22/2/22", score: 89},
    {interviewerID: 2, applicantID: 2, date:"22/2/22", score: 89},
    {interviewerID: 2, applicantID: 5, date:"22/2/22", score: 89},
    {interviewerID: 3, applicantID: 5, date:"22/2/22", score: 89},
    {interviewerID: 3, applicantID: 6, date:"22/2/22", score: 89},
    {interviewerID: 4, applicantID: 4, date:"22/2/22", score: 89},
    {interviewerID: 4, applicantID: 3, date:"22/2/22", score: 89},
]



db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS interviewer;
DROP TABLE IF EXISTS applicants;

CREATE TABLE IF NOT EXISTS interviewers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);   

CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS interviews(
    id INTEGER PRIMARY KEY,
    interviewerID INTEGER NOT NULL,
    applicantID INTEGER NOT NULL,
    date TEXT NOT NULL,
    score INTEGER,
    FOREIGN KEY(interviewerID) REFERENCES interviewers,
    FOREIGN KEY(applicantID) REFERENCES applicants
);`)


const createInterviewer= db.prepare('INSERT INTO interviewers(name,email) VALUES(?,?)')
const createApplicant = db.prepare('INSERT INTO applicants(name,email) VALUES(?,?)')
const createInterview = db.prepare('INSERT INTO interviews(interviewerID, applicantID, date, score) VALUES(?,?,?,?)')


for(const interviewer of interviewers){
    createInterviewer.run(interviewer.name, interviewer.email)
}
for(const applicant of applicants){
    createApplicant.run(applicant.name, applicant.email)
}
for(const interview of interviews){
    createInterview.run(interview.interviewerID, interview.applicantID, interview.date, interview.score)
}

