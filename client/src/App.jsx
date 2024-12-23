import React, { createContext, useContext, useState } from "react"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./routes/Home";
import Navbar from "./components/Navbar";
import PatientForm from "./routes/add/PatientForm";
import AdminDashboard from "./routes/dashboard/AdminDashboard";
import PatientDashboard from "./routes/dashboard/PatientDashboard";
import DoctorDashboard from "./routes/dashboard/DoctorDashboard";
import DoctorAdd from "./routes/add/DoctorAdd";
import DoctorUpdate from "./routes/update/DoctorUpdate";
import AppointmentAdd from "./routes/add/AppointmentAdd";


export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <> 
      <div style={{marginBottom: "55px"}}>
        <Navbar/>
      </div>
      
      <UserContext.Provider value={[user, setUser]}>
        <Router>
            <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/patientForm" element={<PatientForm/>}/>

            <Route path="/adminDashboard/:name" element={<AdminDashboard />}/>
            <Route path="/doctorDashboard/:name" element={<DoctorDashboard />}/>
            <Route path="/patientDashboard/:name" element={<PatientDashboard />}/>

            <Route path="/doctors/add" element={<DoctorAdd />}/>
            <Route path="/doctors/:id/update" element={<DoctorUpdate />}/>

            <Route path="/appointments/:city/:department/:hospital/:doctor/:date" element={<AppointmentAdd/>}/>
          </Routes>
      </Router>
      </UserContext.Provider>
    </>
  )
}

export default App
