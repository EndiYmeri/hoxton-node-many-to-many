import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BasicType, InterviewType } from "../App"
type Props={
    interviews: InterviewType[],
    interviewers: BasicType[],
    applicants: BasicType[],
}

type FormValueType = {
    interviewerID : number | null,
    applicantID : number | null ,
    date : string | null,
    score : number | null
}

export default function InterviewsPage({interviews, interviewers, applicants}:Props){
    
    const [modal, setModal] = useState(false)
    const [formValues, setFormValues] = useState<FormValueType>({
        interviewerID: null,
        applicantID : null ,
        date: null,
        score: null
    })
    const navigate = useNavigate()

    function createInterview(){
        fetch('http://localhost:4000/interviews',{
            method:"POST",
            headers:{
                "content-type": "application/json",
            },
            body:JSON.stringify({
                interviewerID: formValues.interviewerID,
                applicantID: formValues.applicantID,
                date: formValues.date,
                score: formValues.score,
            })
        })
        .then(resp => resp.json())
        .then(interviewCreated => {
            setModal(false)
            navigate(`/interviews/${interviewCreated.id}`)
        })
    }
 
    return (
        <div className="main interviews-page">
            <h1>Interviews conducted</h1>
            <ul className="interviews">
                {
                    interviews?.map(interview=>{
                    return (
                        <li 
                            key={interview.id}
                            className="interview-item" 
                            onClick={()=>{
                                navigate(`/interviews/${interview.id}`)
                            }}
                            >
                            <div className="title">
                                Interview between:<br/> {interview.interviewerID.name} and {interview.applicantID.name} 
                            </div>
                            <div className="interview-info">
                                <div className="date">Date: {interview.date}</div>
                                <div className="score">Score: {interview.score}</div>
                            </div>

                        </li>
                    )
                })}
                <li 
                    className="interview-item"
                    onClick={()=>{
                        setModal(true)
                    }}
                >
                    <h3>+ Add new Interview</h3>
                </li>
            </ul>
        {
            modal? 
                <div className="modal">
                    <div className="modal-inner">
                    <span
                        className="closeModal"
                        onClick={()=>setModal(false)}
                    >X</span>
                            <form 
                                className="createInterviewForm"
                                onSubmit={(e)=>{
                                    e.preventDefault()
                                    createInterview()
                                }}
                            >
                                
                                <h2>Create Interview</h2>
                                <h3>Choose interviewer:</h3>
                                <div className="interviewers-radio-buttons">
                                    {
                                        interviewers?interviewers.map(interviewer=>{
                                            return(
                                                <label key={interviewer.id} htmlFor={interviewer.name}>
                                                    {interviewer.name}
                                                    <input 
                                                        type="radio" 
                                                        name="interviewersRadios" 
                                                        id={interviewer.name} 
                                                        required  
                                                        onChange={(e)=>{
                                                            setFormValues({...formValues, interviewerID: Number(e.target.value)})
                                                        }} 
                                                        value={interviewer.id}/>
                                                </label>    
                                            )
                                        })
                                        :null
                                    }
                                </div>
                                <h3>Choose applicant:</h3>
                                <div className="interviewers-radio-buttons">
                                    {
                                        applicants?applicants.map(applicant=>{
                                            return(
                                                <label key={applicant.id} htmlFor={applicant.name}>
                                                    {applicant.name}
                                                    <input 
                                                        type="radio" 
                                                        name="applicants-radios" 
                                                        id={applicant.name} 
                                                        required  
                                                        onChange={(e)=>{
                                                            setFormValues({...formValues, applicantID: Number(e.target.value)})
                                                        }} 
                                                        value={applicant.id}/>
                                                </label>    
                                            )
                                        })
                                        :null
                                    }
                                </div>
                                <h3>Choose date:</h3>
                                <input 
                                    type="date" 
                                    name="date" 
                                    id="date" 
                                    onChange={(e)=>{
                                        setFormValues({...formValues, date: e.target.value})
                                    }} 
                                    />
                                <h3>Choose score:</h3>
                                <input 
                                    type="number" 
                                    name="score" 
                                    id="score" 
                                    min={0} 
                                    max={100}
                                    onChange={(e)=>{
                                        setFormValues({...formValues, score: Number(e.target.value)})
                                    }} 
                                    />
                                <input type="submit" value="Create Interview" />
                            </form>
                    </div>
                </div>
            : null

        }

        </div>

    )
}