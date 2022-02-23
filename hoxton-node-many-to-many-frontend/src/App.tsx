import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import InterviewsPage from './Pages/InterviewsPage'

export type BasicType={
  id: number,
  name:string,
  email: string
}

export type InterviewType ={
  id:number,
  interviewerID: BasicType,
  applicantID: BasicType,
  date: string,
  score: number
}

function App() {
  const [interviews, setInterviews] = useState<InterviewType[]>()
  const [interviewers, setInterviewers] = useState<BasicType[]>()
  const [applicants, setApplicants] = useState<BasicType[]>()

  useEffect(()=>{
      fetch('http://localhost:4000/interviews')
      .then(resp=> resp.json())
      .then(interviewsFetched => setInterviews(interviewsFetched))

      fetch('http://localhost:4000/interviewers')
      .then(resp=> resp.json())
      .then(interviewersFetched => setInterviewers(interviewersFetched))
      
      fetch('http://localhost:4000/applicants')
      .then(resp=> resp.json())
      .then(applicantsFetched => setApplicants(applicantsFetched))
      
      
  },[])


  console.log(interviews)

    return (
      <div className="App">
          <Routes>
            <Route index element={<Home/>}/>
            {/* @ts-ignore */}
            <Route path='/interviews' element={<InterviewsPage  interviews={interviews} interviewers={interviewers} applicants={applicants} />}/>
            {/* <Route path='/interviews/:id' element={}/> */}
            {/* <Route path='/interviewers' element={}/> */}
            {/* <Route path='/interviewers/:id' element={}/> */}
            {/* <Route path='/applicants' element={}/> */}
            {/* <Route path='/applicants/:id' element={}/> */}
            
          </Routes>
      </div>
    )
}

export default App
